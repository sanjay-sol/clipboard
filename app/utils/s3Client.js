import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();
const s3Client = new S3Client({
 
export { s3Client, s3Credentials };
