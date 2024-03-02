import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./s3Client";
import dotenv from "dotenv";
dotenv.config();

/**
 * Generates a presigned URL for uploading an object to an S3 bucket.
 * @param slug The key (path) of the object in the bucket.
 * @returns A promise that resolves to the presigned URL.
 */
const getPresignedUrl = async (slug: string): Promise<string | undefined> => {
  try {
    const putObjectCommand = new PutObjectCommand({
      Bucket: "clipboard2",
      Key: slug,
    });
    const url = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 5 * 60,
    });
    return url;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return undefined;
  }
};

export default getPresignedUrl;
