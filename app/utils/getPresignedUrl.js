import {  PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./s3Client";
import dotenv from "dotenv";
dotenv.config();

const getPresignedUrl = async (slug) => {
  try {
    const putObjectCommand = new PutObjectCommand({
      Bucket: "clipboard2",
      Key: slug,
    });
    const url = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 3600 * 10,
    });
    return url;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
  }
};

export default getPresignedUrl;
