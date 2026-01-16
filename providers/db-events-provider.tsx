// "use client";

// import { getAppSettings, getFeatureFlags, getUserMetadata } from "@lib/account";
// import { logger } from "@lib/logger";
// import React, { createContext, useContext, useEffect, useState } from "react";

// export type DbEventsData = Record<string, boolean | string> | null;

// export type DbEventsProviderProps = {
//   settings: DbEventsData | null;
//   isConnected: boolean;
//   error: string | null;
// };

// const initialValues: DbEventsProviderProps = {
//   settings: null,
//   isConnected: false,
//   error: null,
// };

// const DbEventsContext = createContext<DbEventsProviderProps>(initialValues);
// const { Provider } = DbEventsContext;

// export interface DbEventsProviderOptions {
//   onDataUpdate?: (newData: any, currentData: any | null) => any;
//   onError?: (error: string) => void;
//   onConnect?: () => void;
//   onDisconnect?: () => void;
// }

// export const DbEventsProvider = ({
//   children,
//   onDataUpdate,
//   onError,
//   onConnect,
//   onDisconnect,
// }: {
//   children: React.ReactNode | React.ReactNode[];
// } & DbEventsProviderOptions) => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [data, setData] = useState<DbEventsData | null>(null);

//   useEffect(() => {
//     (async () => {
//       const flags = await getFeatureFlags();
//       const appSettings = await getAppSettings();
//       const userMetadata = await getUserMetadata();
//       setData({
//         ...(flags || {}),
//         ...(appSettings || {}),
//         ...(userMetadata || {}),
//       });
//     })();
//   }, []);

//   useEffect(() => {
//     const eventSource = new EventSource("/api/db-events");

//     eventSource.onopen = () => {
//       setIsConnected(true);
//       setError(null);
//       onConnect?.();
//     };

//     eventSource.onmessage = (event) => {
//       try {
//         if (event.data !== "heartbeat") {
//           let eventData = JSON.parse(event.data);
//           if (eventData.name) {
//             eventData = {
//               [eventData.name]: eventData.value,
//             };
//           }

//           setData((prevData: DbEventsData | null) => {
//             if (onDataUpdate) {
//               return onDataUpdate(eventData, prevData);
//             }

//             // Default behavior: merge objects or replace primitives
//             if (
//               prevData &&
//               typeof prevData === "object" &&
//               !Array.isArray(prevData)
//             ) {
//               const newData = { ...prevData, ...eventData };
//               return newData;
//             }

//             return eventData;
//           });
//         }
//       } catch (parseError) {
//         const errorMessage = `Failed to parse event data: ${parseError}`;
//         setError(errorMessage);
//         onError?.(errorMessage);
//       }
//     };

//     eventSource.onerror = (error) => {
//       const errorMessage = `EventSource connection failed: ${error}`;
//       logger.error(errorMessage, {
//         error,
//       });

//       setIsConnected(false);
//       setError(errorMessage);
//       onError?.(errorMessage);
//       onDisconnect?.();
//       eventSource.close();
//     };

//     return () => {
//       setIsConnected(false);
//       onDisconnect?.();
//       eventSource.close();
//     };
//   }, [onDataUpdate, onError, onConnect, onDisconnect]);

//   return (
//     <Provider value={{ settings: data, isConnected, error }}>
//       {children}
//     </Provider>
//   );
// };

// export const useDbEvents = (): DbEventsProviderProps => {
//   const context = useContext(DbEventsContext);
//   if (!context) {
//     throw new Error("useDbEvents must be used within a DbEventsProvider");
//   }
//   return context as DbEventsProviderProps;
// };
"use client";

import { getAppSettings, getFeatureFlags, getUserMetadata } from "@lib/account";
import { logger } from "@lib/logger";
import React, { createContext, useContext, useEffect, useState } from "react";

export type DbEventsData = Record<string, boolean | string> | null;

export type DbEventsProviderProps = {
  settings: DbEventsData | null;
  isConnected: boolean;
  error: string | null;
};

const initialValues: DbEventsProviderProps = {
  settings: null,
  isConnected: false,
  error: null,
};

const DbEventsContext = createContext<DbEventsProviderProps>(initialValues);
const { Provider } = DbEventsContext;

export const DbEventsProvider = ({
  children,
  onDataUpdate,
  onError,
  onConnect,
  onDisconnect,
}: {
  children: React.ReactNode | React.ReactNode[];
  onDataUpdate?: (newData: any, currentData: any | null) => any;
  onError?: (error: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}) => {
  const [mounted, setMounted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DbEventsData | null>(null);

  // ✅ Ensure hydration-safe mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Fetch initial data ONLY after mount
  useEffect(() => {
    if (!mounted) return;

    (async () => {
      try {
        const [flags, appSettings, userMetadata] = await Promise.all([
          getFeatureFlags(),
          getAppSettings(),
          getUserMetadata(),
        ]);

        setData({
          ...(flags || {}),
          ...(appSettings || {}),
          ...(userMetadata || {}),
        });
      } catch (err) {
        setError("Failed to load initial settings");
      }
    })();
  }, [mounted]);

  // ✅ EventSource only after mount + browser
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const eventSource = new EventSource("/api/db-events");

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
      onConnect?.();
    };

    eventSource.onmessage = (event) => {
      if (event.data === "heartbeat") return;

      try {
        let eventData = JSON.parse(event.data);

        if (eventData?.name) {
          eventData = { [eventData.name]: eventData.value };
        }

        setData((prev) => {
          if (onDataUpdate) return onDataUpdate(eventData, prev);
          return prev && typeof prev === "object"
            ? { ...prev, ...eventData }
            : eventData;
        });
      } catch {
        // ❌ Do NOT log during hydration
        setError("Invalid event data received");
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      setError("EventSource disconnected");
      onDisconnect?.();
      eventSource.close();
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [mounted, onDataUpdate, onConnect, onDisconnect]);

  // ✅ Prevent rendering before hydration stabilizes
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <Provider value={{ settings: data, isConnected, error }}>
      {children}
    </Provider>
  );
};

export const useDbEvents = (): DbEventsProviderProps => {
  return useContext(DbEventsContext);
};
