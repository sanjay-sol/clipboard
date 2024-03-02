import axios from "axios";
import mime from "mime-types";

const API_URI = "/api/aws";

/**
 * Gets a signed URL for uploading a file to AWS S3.
 * @param slug The slug for the API endpoint.
 * @returns A promise that resolves to the signed URL.
 */

export const getSignedUrl = async (
  slug: string
): Promise<string | undefined> => {
  try {
    const response = await axios.get(`${API_URI}/${slug}`);
    return response.data?.url;
  } catch (error:any) {
    console.log("Error while calling the API ", error.message);
    return undefined;
  }
};

/**
 * Uploads a file to the specified URL.
 * @param url The URL to upload the file to.
 * @param file The file to upload.
 * @returns A promise that resolves to the upload response.
 */
export const uploadFile = async (url: string, file: File): Promise<any> => {
  try {
    const response = await axios.put(url, file, {
      headers: {
        "Content-Type": mime.lookup(file.name) || "application/octet-stream",
      },
    });
    return response;
  } catch (error : any) {
    console.log("Error while calling the API ", error.message);
    return error;
  }
};
