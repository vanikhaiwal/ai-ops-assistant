import { SignUp } from "@clerk/nextjs";
import Header from "@/components/header";

export default function SignUpPage() {
  return (
   <div className="w-full min-h-screen overflow-x-hidden bg-white">
      <Header />
      <div className="flex flex-col items-center justify-center mt-5  shadow-md  rounded-lg max-w-sm mx-auto">
      <SignUp path="/sign-up" />
      </div>
         </div>
  );
}
