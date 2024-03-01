"use client";
import React, { useState, useEffect } from "react";
import { getSignedUrl, uploadFile } from "../utils/handler";
import { getObjectUrl } from "../utils/getObject";
import toast, { Toaster } from "react-hot-toast";
type Props = {
  params: {
    key: string;
  };
};
const App = ({ params }: Props) => {
  const param: string = params.key;
  console.log("param", param);

  const [url, setUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hadObject, setHadObject] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null = e.target.files?.[0] || null;
    setSelectedFile(file);
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
        console.log("url", url);
      } catch (error) {
        console.error("Error fetching signed URL:", error);
      }
    };
    fetchData();
  }, [param]);

  const handleUpload = async () => {
    if (!url || !selectedFile) return;
    try {
      const response: any = await uploadFile(url, selectedFile);
      if (response && response?.status === 200) {
        toast.success("Clip created successfully ..page refreshes in 5 sec", {
          id: "1",
        });
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      } else {
         toast.error("Presigned url has Expired ..page refreshes in 5 sec", {
           id: "1",
         });
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      toast.error("Presigned url has Expired ..page refreshes in 5 sec", { id: "1" });
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
            <Toaster />
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
                </div>
              </>
            ) : (
              <>
                <Toaster />
                <input type="file" onChange={handleFileChange} />
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
