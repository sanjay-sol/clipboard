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
  console.log("param", param);

  const [url, setUrl] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [hadObject, setHadObject] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

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

  // const timer: any = document.getElementById("timer");
  // let timeleft = 3;
  // let downloadTimer = setInterval(function () {
  //   if (timeleft <= 0 && timer) {
  //     timer.innerHTML = timeleft + " time up remaining";
  //     clearInterval(downloadTimer);
  //   }
  //   if (timer) {
  //     timer.innerHTML = timeleft + " seconds remaining";
  //     timeleft -= 1;
  //   }
  // }, 1000);

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
        console.log("url", url);
      } catch (error) {
        console.error("Error fetching signed URL:", error);
      }
    };
    fetchData();
  }, [param]);

  const handleUpload = async () => {
    if (!url || selectedFiles.length === 0) return;
    try {
      if (selectedFiles.length == 1) {
        const uploadResponse: any = await uploadFile(url, selectedFiles[0]);
        console.log("response", uploadResponse);
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
          console.error("Error uploading file to S3:::", uploadResponse);
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
        console.log("response--", uploadResponse);
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
          console.error("Error uploading file to S3:::", uploadResponse);
          toast.error("Presigned url has expired ..page refreshes in 5 sec", {
            id: "1",
          });
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      }
    } catch (error) {
      console.error("Error uploading file to S3:sss", error);
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
                    <p>Page Refreshes in </p> <p id="timer"></p>
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
