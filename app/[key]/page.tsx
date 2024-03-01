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
        if (!url) {
          const getObject = await getObjectUrl(param);
          const result = await axios.get(`/api/db/${param}`);
          if (result?.data?.posts) {
            setResultText(result?.data?.posts.text);
          }
          setUrl(getObject);
          setHadObject(true);
          setLoading(false);
          return;
        }
        setUrl(url);
        setLoading(false);
      } catch (error) {
        toast.error(`Presigned url has expired ..${error}`, {
          id: "1",
        });
      }
    };
    fetchData();
  }, [param]);

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
    try {
      if (!url || selectedFiles.length === 0 || !selectedFiles) return;
      if (selectedFiles.length === 1) {
        const uploadResponse: any = await uploadFile(url, selectedFiles[0]);
        console.log("ui", uploadResponse);
        await axios.post(`/api/db/${param}`, text);
        if (uploadResponse && uploadResponse.status === 200) {
          toast.success(
            "Files uploaded successfully..page refreshes in 5 sec",
            {
              id: "1",
            }
          );
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        } else {
          toast.error("Presigned url has expired >2..page refreshes in 5 sec", {
            id: "1",
          });
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      } else {
        const formData = await zipFiles(selectedFiles);
        const uploadResponse: any = await uploadFile(url, formData);
        if (uploadResponse && uploadResponse.status === 200) {
          toast.success(
            "Files uploaded successfully >> ..page refreshes in 5 sec",
            {
              id: "1",
            }
          );
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        } else {
          toast.error(
            "Presigned url has expired >>2 ..page refreshes in 5 sec",
            {
              id: "1",
            }
          );
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      }
    } catch (error) {
      toast.success("Content Uploaded Successfully", {
        id: "1",
      });
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  };

  return (
    <div>
      <Toaster />
      <>
        {loading ? (
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
        ) : (
          <>
            {hadObject ? (
              <>
                <div className="border-b-2 border-gray-500 mt-5 pb-3 text-white bg-slate-900 h-20 m-3 item-center content-center justify-center text-center">
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
                  <div className="flex items-start flex-col justify-center ">
                    {resultText && (
                      <div className=" overflow-x-scroll p-4 rounded-sm h-screen w-screen mt-3  bg-slate-900">
                        <pre className="text-white">{resultText}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center flex-col pt-4 pb-4 bg-slate-900 m-3">
                  {/* <label htmlFor="url" className='pl-4 pr-4'>URL:</label> */}
                  <input type="file" onChange={handleFileChange} multiple />
                  <button
                    className="w-48 px-1 py-2 m-3 font-bold text-white bg-slate-600 rounded-lg"
                    data-primary="blue-600"
                    data-rounded="rounded-lg"
                    onClick={handleUpload}
                  >
                    Upload
                  </button>
                  <p className="text-red-600"> Max size : 1 GB</p>
                </div>
                <div className="flex items-center justify-center flex-row m-3">
                  <p className="text-xl">Page Refreshes in : </p>{" "}
                  <span id="timer" className=" text-2xl pl-2 text-red-600">
                    {Math.floor(timeLeft / 60)} min {Math.floor(timeLeft % 60)}{" "}
                    seconds
                  </span>
                </div>
                <div className="flex items-center justify-start m-3 ">
                  {/* <label htmlFor="text" className='pl-3 pr-4'>Text:</label> */}
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
