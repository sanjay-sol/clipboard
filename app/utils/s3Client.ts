import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

// AWS S3 client configuration
const s3Config: S3ClientConfig = {
  region: process.env.AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_ID || "",
    secretAccessKey: process.env.AWS_SECRET_KEY || "",
  },
};

// Create the AWS S3 client
const s3Client = new S3Client(s3Config);

// AWS S3 credentials
const s3Credentials = {
  bucket: process.env.AWS_BUCKET || "",
  region: process.env.AWS_REGION || "",
  accessKeyId: process.env.AWS_ACCESS_ID || "",
  secretAccessKey: process.env.AWS_SECRET_KEY || "",
};

export { s3Client, s3Credentials };
