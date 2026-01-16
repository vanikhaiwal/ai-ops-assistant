import ClientOnly from "@/components/client-only";
import Image from "next/image";
import Link from "next/link";
import { GoToChatButton } from "./page-client";

export default function Home() {
  return (
    <ClientOnly>
      <div className="w-screen min-h-screen relative bg-gradient-to-br from-indigo-100 via-violet-100 to-purple-200">
        <Link href="/" className="absolute top-8 left-8">
          <Image src="/askpdf-logo.svg" alt="logo" width="140" height="100" />
        </Link>
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-5">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-7xl font-bold text-neutral-900 pt-40 mt-10">
              docChat
            </h1>
            <p className="max-w-2xl text-md text-neutral-700 text-center">
              Get instant answers from your pdf using ai powered chat
              <br></br>
              Upload Pdf  Spill the beans in chat   Get answers
            </p>
          </div>
          <GoToChatButton />
          <div className="backdrop-blur-sm bg-white/50 p-3 rounded-md mt-5">
            <Image
              src="/demo.webp"
              alt="demo image of the app"
              width="700"
              height="400"
              className="rounded-md"
            />
          </div>
          <h2 className="font-bold text-4xl text-gray-800 pt-10 mt-20">Get QUICK information RETRIEVAL from PDFs</h2>
          <div className="flex gap-10 mt-5 mb-20 text-center">
            <div className="flex flex-col gap-2">
              {/* <Image src="./" alt="logo" width="140" height="100" /> */}
              <h3 className="text-2xl text-black">Upload Your PDF</h3>
              <p className="text-center text-black">Simply drag and drop your PDF file and click to upload, and start using the tool instantly.</p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl text-black">Ask Questions</h3>
              <p className="text-center text-black">Get instant summaries, extract information and ask any questions about your document with AI.</p>
            </div>
          </div>
          <div className="bg-gray-900 w-screen h-[250px] flex gap-30 text-center">
            <div className="flex flex-col items-center justify-center text-white mt-10 w-1/3 px-10">
              <h3 className="text-sm font-bold">docChat brings AI intelligence and PDF technology together for smarter document understanding. Summarize, chat, analyze - start now.</h3>
            </div>
            <div className="flex flex-col items-center justify-center text-white mt-10">
              © 2026 docChat. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
