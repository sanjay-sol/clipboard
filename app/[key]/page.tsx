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
  const [formData, setFormData] = useState<File | Blob | null>(null);
  const [response, setResponse] = useState<any>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    if (files) {
      const fileList: File[] = Array.from(files);
      setSelectedFiles(fileList);
    }
  };

  const zipFiles = async (files : File[]) => {
    const zip = new JSZip();
    files.forEach((file, index) => {
      zip.file(`${file.name ? file.name : `file${index}`}`, file);
    });

    const formData = await zip.generateAsync({ type: "blob" });
    return formData;
  };

  const uploadFiles = async (url : any , formData: File | Blob | null) => {
    const response: any = await uploadFile(url, formData);
    setResponse(response);
  }

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
        // console.log("selectedFiles[0]", selectedFiles[0])
        await uploadFiles(url, selectedFiles[0]);
      } else {
        const formData = await zipFiles(selectedFiles);
        console.log("formData", formData)
        await uploadFiles(url, formData);
      }
      console.log("response", response);
      if (response) {
        toast.success("Files uploaded successfully ..page refreshes in 5 sec", {
          id: "1",
        });
        // setTimeout(() => {
        //   window.location.reload();
        // }, 5000);
      } else {
      console.error("Error uploading file to S3:::", response);
        toast.error("Presigned url has expired ..page refreshes in 5 sec", {
          id: "1",
        });
        // setTimeout(() => {
        //   window.location.reload();
        // }, 5000);
      }
    } catch (error) {
      console.error("Error uploading file to S3:sss", error);
      toast.error("Presigned url has expired ..page refreshes in 5 sec", {
        id: "1",
      });
      // setTimeout(() => {
      //   window.location.reload();
      // }, 5000);
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
