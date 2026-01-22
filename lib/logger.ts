const env = process.env.NODE_ENV;

export interface Logger {
  info(message: string, extra?: any): void;
  error(message: string, extra?: any): void;
  debug(message: string, extra?: any): void;
  warn(message: string, extra?: any): void;
  fatal(message: string, extra?: any): void;
}

export const logger: Logger = {
  info(message, extra) {
    log("info", message, extra);
  },
  error(message, extra) {
    log("error", message, extra);
  },
  debug(message, extra) {
    log("debug", message, extra);
  },
  warn(message, extra) {
    log("warn", message, extra);
  },
  fatal(message, extra) {
    log("fatal", message, extra);
  },
};

function log(
  level: "info" | "error" | "warn" | "fatal" | "debug",
  message: string,
  extra?: any
) {
  const prefix = `[${level.toUpperCase()}]`;

  if (env === "production") {
    console[level === "fatal" ? "error" : level](prefix, message, extra ?? "");
  } else {
    console[level === "fatal" ? "error" : level](prefix, message, extra ?? "");
  }
}
