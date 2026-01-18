import ClientOnly from "@/components/client-only";
import Image from "next/image";
import Link from "next/link";
import { GoToChatButton } from "./page-client";
import Header from "@/components/header";

export default function Home() {
  return (
    <ClientOnly>
      {/* ROOT WRAPPER */}
      <div className="w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-indigo-100 via-violet-100 to-purple-200">
        <Header />

        {/* MAIN CONTENT */}
        <div className="w-full flex flex-col items-center justify-center gap-3 px-5">
          {/* HERO */}
          <div className="flex flex-col items-center gap-2 pt-40 mt-10 text-center">
            <h1 className="text-7xl font-bold text-neutral-900">
              docChat
            </h1>
            <p className="max-w-2xl text-md text-neutral-700">
              Get instant answers from your PDF using AI powered chat
              <br />
              Upload PDF • Spill the beans in chat • Get answers
            </p>
          </div>

          <GoToChatButton />

          {/* DEMO IMAGE */}
          <div className="backdrop-blur-sm bg-white/50 p-3 rounded-md mt-5">
            <Image
              src="/demo.webp"
              alt="demo image of the app"
              width={700}
              height={400}
              className="rounded-md"
              priority
            />
          </div>

          {/* FEATURES */}
          <h2 className="font-bold text-4xl text-gray-800 pt-10 mt-20 text-center">
            Get QUICK information RETRIEVAL from PDFs
          </h2>

          <div className="flex flex-col items-center mt-5 mb-20 text-center gap-10 max-w-3xl">
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-bold text-gray-800">
                Upload Your PDF
              </h3>
              <p className="text-gray-800">
                Simply drag and drop your PDF file and click to upload, and
                start using the tool instantly.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-bold text-gray-800">
                Ask Questions
              </h3>
              <p className="text-gray-800">
                Get instant summaries, extract information and ask any
                questions about your document with AI.
              </p>
            </div>
          </div>
          <div className="w-1/3 h-1/3 bg-gray-800 rounded-lg m-10 p-5 flex flex-col items-center justify-center">
           <h1 className="text-3xl text-gray-100">Get Started </h1>
           <p className="text-sm text-gray-100">Ready to transform your PDFs into valuable insights? Try it now!</p>
          </div>

          {/* FOOTER */}
          <footer className="bg-gray-900 w-screen h-[250px] flex flex-col p-10 md:flex-row text-center text-white">
            <div className="flex flex-col items-center justify-center gap-2 px-10 w-full md:w-1/3">
              <h3 className="text-lg font-bold">Connect with me</h3>

              <Link
                href="https://www.linkedin.com/in/vani-khaiwal-917aa1297"
                target="_blank"
                className="underline"
              >
                LinkedIn
              </Link>

              <Link
                href="https://github.com/vanikhaiwal"
                target="_blank"
                className="underline"
              >
                GitHub
              </Link>

              <Link
                href="https://leetcode.com/u/vani_khaiwal/"
                target="_blank"
                className="underline"
              >
                LeetCode
              </Link>
            </div>

            <div className="flex items-center justify-center w-full md:w-2/3">
              © 2026 docChat
            </div>
          </footer>
        </div>
      </div>
    </ClientOnly>
  );
}
