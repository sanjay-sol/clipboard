import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";

/**
 * Checks if an object exists in the specified S3 bucket.
 * @param bucketName The name of the S3 bucket.
 * @param key The key (path) of the object in the bucket.
 * @returns A promise that resolves to true if the object exists, false otherwise.
 */

async function doesObjectExist(
  bucketName: string,
  key: string
): Promise<boolean> {
  try {
    // Send a HEAD request to the object
    const command = new HeadObjectCommand({ Bucket: bucketName, Key: key });
    await s3Client.send(command);
    return true; // Object exists
  } catch (error: any) {
    if (error.name === "NotFound") {
      return false; // Object does not exist
    }
    throw error; // Other errors
  }
}

export default doesObjectExist;
