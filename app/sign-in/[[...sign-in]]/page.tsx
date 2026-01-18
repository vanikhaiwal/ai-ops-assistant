import { SignIn } from "@clerk/nextjs";
import Header from "@/components/header";

export default function SignInPage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-white">
      <Header />
      <div className="flex flex-col items-center justify-center mt-20  shadow-md  rounded-lg max-w-sm mx-auto">
      <SignIn path="/sign-in" />
      </div>
    </div>
  );
}
