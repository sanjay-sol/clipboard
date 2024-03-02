"use client";
import React, { useState, useEffect, use } from "react";
import { getSignedUrl, uploadFile } from "../utils/handler";
import { getObjectUrl } from "../utils/getObject";
import toast, { Toaster } from "react-hot-toast";
import JSZip from "jszip";
import axios from "axios";
import { useRouter } from "next/navigation";
type Props = {
  params: {
    key: string;
  };
};

const App = ({ params }: Props) => {
  const router = useRouter();
  const param: string = params.key;

  const [url, setUrl] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [hadObject, setHadObject] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(5 * 60);
  const [text, setText] = useState<string>("");
  const [resultText, setResultText] = useState<string>("");
  const [zipping, setZipping] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    if (files) {
      const fileList: File[] = Array.from(files);
      setSelectedFiles(fileList);
    }
  };

  const zipFiles = async (files: File[]) => {
    const zip = new JSZip();
    files.forEach((file, index) => {
      zip.file(`${file.name ? file.name : `file${index}`}`, file);
    });

    const formData = await zip.generateAsync({ type: "blob" });
    return formData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url: string = await getSignedUrl(param);
        console.log("url", url);
        const result = await axios.get(`/api/db/${param}`);
        if (result?.data?.posts) {
          setResultText(result?.data?.posts?.text);
          console.log("result", result?.data?.posts?.text);
        }
        console.log(!resultText, "resultText");
        if (!url) {
          const getObject = await getObjectUrl(param);
          const result = await axios.get(`/api/db/${param}`);
          console.log(param, "param");
          if (result?.data?.posts) {
            setResultText(result?.data?.posts?.text);
            console.log("result", result?.data?.posts?.text);
          }
          setUrl(getObject);
          setHadObject(true);
          setLoading(false);
          return;
        }
        setUrl(url);
        setLoading(false);
      } catch (error: any) {
        toast.error(`Presigned url has expired: ${error.message}`, {
          id: "1",
        });
      }
    };
    fetchData();
  }, [param, resultText]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft === 0) {
          window.location.reload();
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleUpload = async () => {
    if (!url) return;
    try {
      let formData;
      if (selectedFiles.length > 0) {
        if (selectedFiles.length === 1) {
          formData = selectedFiles[0];
        } else {
          setZipping(true);
          formData = await zipFiles(selectedFiles);
        }
        const uploadResponse: any = await uploadFile(url, formData);
        if (uploadResponse.status !== 200) {
          throw new Error("Failed to upload files");
        }
      }
      if (text) {
        console.log("inside text", text)
        const init = async (text:string) => {
          await fetch(`/api/db/${param}`, {
            method: "POST",
            body: text,
          });
        }
        init(text);
      }
      setZipping(false);
      toast.success("Content uploaded successfully", { id: "1" });
      setTimeout(() => {
        router.push("/");
      }, 0);
    } catch (error: any) {
      setZipping(false);
      toast.error(`Failed to upload content: ${error.message}`, { id: "1" });
      console.error("Upload error:", error);
    }
  };

  const loadingAnimation = () => {
    return (
      <>
        <div className="animate-pulse flex flex-col items-center gap-4 p-4">
          <div>
            <div className="w-48 h-6 bg-slate-400 rounded-md"></div>
            <div className="w-28 h-4 bg-slate-400 mx-auto mt-3 rounded-md"></div>
          </div>
          <div className="h-7 bg-slate-400 w-full rounded-md"></div>
          <div className="h-7 bg-slate-400 w-full rounded-md"></div>
          <div className="h-7 bg-slate-400 w-full rounded-md"></div>
          <div className="h-7 bg-slate-400 w-1/2 rounded-md"></div>
          <div className="h-7 bg-slate-400 w-full rounded-md"></div>
          <div className="h-7 bg-slate-400 w-full rounded-md"></div>
          <div className="h-7 bg-slate-400 w-1/2 rounded-md"></div>
          <div className="h-7 bg-slate-400 w-full rounded-md"></div>
        </div>
      </>
    );
  }

  // const fileUploadUI = () => {

  // }

  return (
    <div>
      <Toaster />
      <>
        {loading ? (
          loadingAnimation()
        ) : (
          <>
            {hadObject || resultText ? (
              <div className="border-b-2 border-gray-500 mt-5 pb-3 text-white bg-slate-900 h-20 m-3 item-center content-center justify-center text-center">
                {hadObject && (
                  <>
                    <label htmlFor="url">Your File </label>
                    <br />
                    <div className="m-3">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-purple-500 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-sm animate-pulse"
                      >
                        View ＆ Download
                      </a>
                    </div>
                  </>
                )}
                <div className="flex items-start flex-col justify-center ">
                  {resultText && (
                    <div className=" overflow-x-scroll p-4 rounded-sm h-screen w-screen mt-3  bg-slate-900">
                      <pre className="text-white">{resultText}</pre>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <h1 className=" flex flex-col items-center p-5 text-3xl pl-3 text-gray-400 font-extrabold  font-serif">
                  Create a New Clip
                </h1>
                <div className="flex justify-evenly">
                  {zipping ? (
                    <div>
                      <button className="bg-rose-800 text-rose-400 border border-rose-400 border-b-4 m-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                        <span className="bg-rose-400 shadow-rose-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                        Uploading Content...
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={handleUpload}
                        className="bg-rose-950 text-rose-400 border border-rose-400 border-b-4 m-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                      >
                        <span className="bg-rose-400 shadow-rose-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                        Create Clip
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-center flex-row m-3">
                    <p className="text-xl">Page Refreshes in : </p>{" "}
                    <span id="timer" className=" text-2xl pl-2 text-red-600">
                      {Math.floor(timeLeft / 60)} min{" "}
                      {Math.floor(timeLeft % 60)} seconds
                    </span>
                  </div>
                </div>
                <div className="flex items-center flex-col pt-4 pb-4 bg-slate-900 m-3">
                  <div className="mx-auto max-w-xs">
                    <label
                      htmlFor="example1"
                      className="mb-1 block text-sm font-medium text-gray-500"
                    >
                      Upload file
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      multiple
                      className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary-500 file:py-2.5 file:px-4 file:text-sm file:font-semibold file:text-slate-900 hover:file:bg-primary-300 focus:outline-none cursor-pointer disabled:opacity-60"
                    />
                  </div>
                  <p className="text-red-600"> Max size : 1 GB</p>
                </div>
                <div className="flex items-center justify-start m-3 ">
                  <textarea
                    id="text"
                    className="text-gray-300 overflow-x-scroll p-4 rounded-sm h-screen w-screen mt-3  bg-slate-900"
                    value={text}
                    placeholder="Text goes here ........."
                    onChange={(e) => setText(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
          </>
        )}
      </>
    </div>
  );
};

export default App;