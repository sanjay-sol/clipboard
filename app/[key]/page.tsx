import React, { useState, useEffect } from "react";
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

type State = {
  url: string;
  selectedFiles: File[];
  hadObject: boolean;
  loading: boolean;
  timeLeft: number;
  text: string;
  resultText: string;
  zipping: boolean;
};

const initialState: State = {
  url: "",
  selectedFiles: [],
  hadObject: false,
  loading: true,
  timeLeft: 5 * 60,
  text: "",
  resultText: "",
  zipping: false,
};

const App: React.FC<Props> = ({ params }) => {
  const router = useRouter();
  const param: string = params.key;
  const [state, setState] = useState<State>(initialState);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    if (files) {
      const fileList: File[] = Array.from(files);
      setState((prevState) => ({
        ...prevState,
        selectedFiles: fileList,
      }));
    }
  };

  const zipFiles = async (files: File[]) => {
    const zip = new JSZip();
    files.forEach((file, index) => {
      zip.file(`${file.name ? file.name : `file${index}`}`, file);
    });

    return await zip.generateAsync({ type: "blob" });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const signedUrl: string = await getSignedUrl(param);
        const result = await axios.get(`/api/db/${param}`);
        if (result?.data?.posts) {
          setState((prevState) => ({
            ...prevState,
            resultText: result?.data?.posts?.text,
          }));
        }
        if (!signedUrl) {
          const getObject = await getObjectUrl(param);
          const result = await axios.get(`/api/db/${param}`);
          if (result?.data?.posts) {
            setState((prevState) => ({
              ...prevState,
              resultText: result?.data?.posts?.text,
            }));
          }
          setState((prevState) => ({
            ...prevState,
            url: getObject,
            hadObject: true,
            loading: false,
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            url: signedUrl,
            loading: false,
          }));
        }
      } catch (error: any) {
        toast.error(`Presigned url has expired: ${error.message}`, {
          id: "1",
        });
      }
    };
    fetchData();
  }, [param, state.resultText]);

  useEffect(() => {
    const timer = setInterval(() => {
      setState((prevState) => ({
        ...prevState,
        timeLeft: prevState.timeLeft - 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = () => {
    if (state.resultText) {
      navigator.clipboard.writeText(state.resultText);
      toast.success("Text copied to clipboard", { id: "1" });
    }
  };

  const handleUpload = async () => {
    if (!state.url) return;

    try {
      let formData;
      if (state.selectedFiles.length > 0) {
        setState((prevState) => ({ ...prevState, zipping: true }));
        formData =
          state.selectedFiles.length === 1
            ? state.selectedFiles[0]
            : await zipFiles(state.selectedFiles);

        const uploadResponse = await uploadFile(state.url, formData);
        if (uploadResponse.status !== 200) {
          throw new Error("Failed to upload files");
        }
      }

      if (state.text) {
        await fetch(`/api/db/${param}`, {
          method: "POST",
          body: state.text,
        });
      }

      setState((prevState) => ({ ...prevState, zipping: false }));
      toast.success("Content uploaded successfully", { id: "1" });
      setTimeout(() => {
        router.push("/");
      }, 0);
    } catch (error: any) {
      setState((prevState) => ({ ...prevState, zipping: false }));
      toast.error(`Failed to upload content: ${error.message}`, { id: "1" });
    }
  };

  return (
    <div>
      <Toaster />
      {state.loading ? (
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
          {state.hadObject || state.resultText ? (
            <>
              {state.hadObject && (
                <div className="flex flex-col items-center mt-5 p-8 text-white bg-slate-900 m-3 ">
                  <label htmlFor="url">Your File(s) </label>
                  <br />
                  <div className="">
                    <a
                      href={state.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-purple-500 hover:bg-purple-800 text-white font-bold py-5 px-10 rounded-md animate-pulse"
                    >
                      View & Download
                    </a>
                  </div>
                </div>
              )}
              <br />
              {state.resultText && (
                <div className="flex items-start flex-col justify-center ">
                  <div className=" overflow-x-scroll p-4 rounded-sm h-screen w-screen mt-3  bg-slate-900">
                    <pre className="text-white">{state.resultText}</pre>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <h1 className=" flex flex-col items-center p-5 text-3xl pl-3 text-gray-400 font-extrabold  font-serif">
                Create a New Clip
              </h1>
              <div className="flex justify-evenly">
                {state.zipping ? (
                  <button className="bg-rose-800 text-rose-400 border border-rose-400 border-b-4 m-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                    <span className="bg-rose-400 shadow-rose-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                    Uploading Content...
                  </button>
                ) : (
                  <button
                    onClick={handleUpload}
                    className="bg-rose-950 text-rose-400 border border-rose-400 border-b-4 m-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                  >
                    <span className="bg-rose-400 shadow-rose-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                    Create Clip
                  </button>
                )}
                <div className="flex items-center justify-center flex-row m-3">
                  <p className="text-xl">Page Refreshes in : </p>{" "}
                  <span id="timer" className=" text-2xl pl-2 text-red-600">
                    {Math.floor(state.timeLeft / 60)} min{" "}
                    {Math.floor(state.timeLeft % 60)} seconds
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
                  value={state.text}
                  placeholder="Text goes here ........."
                  onChange={(e) => setState({ ...state, text: e.target.value })}
                  required
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;