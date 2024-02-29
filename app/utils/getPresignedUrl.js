import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_ID,
  },
});

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
