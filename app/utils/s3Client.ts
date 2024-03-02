import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

// AWS S3 client configuration
const s3Config: S3ClientConfig = {
  region: process.env.AWS_REGION_VAR || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_ID_VAR || "",
    secretAccessKey: process.env.AWS_SECRET_KEY_VAR || "",
  },
};

// Create the AWS S3 client
const s3Client = new S3Client(s3Config);

// AWS S3 credentials
const s3Credentials = {
  bucket: process.env.AWS_BUCKET_VAR || "",
  region: process.env.AWS_REGION_VAR || "",
  accessKeyId: process.env.AWS_ACCESS_ID_VAR || "",
  secretAccessKey: process.env.AWS_SECRET_KEY_VAR || "",
};

export { s3Client, s3Credentials };
