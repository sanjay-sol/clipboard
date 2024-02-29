"use client";
import React, { useState, useEffect } from "react";
import { getSignedUrl, uploadFile } from "../utils/handler";
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url: string = await getSignedUrl(param);
        setUrl(url);
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
      console.log(response);
    } catch (error) {
      console.error("Error uploading file to S3:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default App;
