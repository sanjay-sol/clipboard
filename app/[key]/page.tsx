"use client";
import React, { useState, useEffect } from "react";
import { getSignedUrl, uploadFile } from "../utils/handler";
import { getObjectUrl } from "../utils/getObject";
import toast, { Toaster } from "react-hot-toast";
import JSZip from "jszip";

type Props = {
  params: {
    key: string;
  };
};

const App = ({ params }: Props) => {
  const param: string = params.key;

  const [url, setUrl] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [hadObject, setHadObject] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(5*60);

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
    if (!url || selectedFiles.length === 0) return;
    try {
      if (selectedFiles.length === 1) {
        const uploadResponse: any = await uploadFile(url, selectedFiles[0]);
        if (uploadResponse && uploadResponse.status === 200) {
          toast.success(
            "Files uploaded successfully ..page refreshes in 5 sec",
            {
              id: "1",
            }
          );
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        } else {
          toast.error("Presigned url has expired ..page refreshes in 5 sec", {
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
            "Files uploaded successfully ..page refreshes in 5 sec",
            {
              id: "1",
            }
          );
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        } else {
          toast.error("Presigned url has expired ..page refreshes in 5 sec", {
            id: "1",
          });
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      }
    } catch (error) {
      toast.error("Presigned url has expired ..page refreshes in 5 sec", {
        id: "1",
      });
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  };

  return (
    <div>
      <Toaster />
      <>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {hadObject ? (
              <>
                <div className="m-3">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-500 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-sm animate-pulse"
                  >
                    Download
                  </a>
                  <p>{url}</p>
                </div>
              </>
            ) : (
              <>
                <p>Page Refreshes in </p>{" "}
                <p id="timer">
                  {Math.floor(timeLeft / 60)} min {Math.floor(timeLeft % 60)}{" "}
                  seconds
                </p>
                <input type="file" onChange={handleFileChange} multiple />
                <button onClick={handleUpload}>Upload</button>
              </>
            )}
          </>
        )}
      </>
    </div>
  );
};

export default App;
