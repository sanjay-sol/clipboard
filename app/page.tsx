"use client";
import Link from "next/link";
import React, { useState } from "react";
export default function Home() {
  const [text, setText] = useState<string>("");
  return (
    <>
      <div>
        <div className="h-screen  bg-slate-900 m-4">
          <div className=" text-lg p-7">
            <p>📋 Welcome to cl1p.vercel.app - Your Internet Clipboard!</p>
            <p>✨ Seamlessly upload any type of data upto 1GB for free .</p>
            <p> 📄 Share text, files, images, and more effortlessly.</p>
            <p>
              {" "}
              🔒 Secure and private: Your data is encrypted and accessible only
              via your unique URL.
            </p>
            <br />
            <p className="mt-2 mb-2">
              {" "}
              🚀 cvrclip.vercel.app/
              <input
                type="text"
                className="text-black mr-1 ml-1 bg-gray-300 p-1 rounded-sm "
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Link href={text}>
                <button className="bg-yellow-700 p-1 pr-3 pl-3 ml-2 rounded-sm  ">
                  Go
                </button>
              </Link>
            </p>
            <br />
            <div className="mt-3 ml-4 mr-4">
              <p className="text-gray-300 font-bold text-2xl">
                {" "}
                Detailed Instructions :
              </p>
              <div className="mt-3">
                <p>1 . Enter in a URL that starts with cl1p.vercel.app</p>
                <p>2 . Upload in data</p>
                <p>3 . On another device enter in the same URL</p>
                <p>4 . Get your data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
