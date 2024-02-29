import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { S3Client } from "./s3Client";

async function doesObjectExist(bucketName, key) {
  try {
    // Send a HEAD request to the object
    const command = new HeadObjectCommand({ Bucket: bucketName, Key: key });
      await S3Client.send(command);
    return true; // Object exists
  } catch (error) {
    if (error.name === "NotFound") {
      return false; // Object does not exist
    }
    throw error; // Other errors
  }
}

export default doesObjectExist;
