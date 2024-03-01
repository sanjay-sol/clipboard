import axios from "axios";
import mime from "mime-types";
const API_URI = "/api/aws";

export const getSignedUrl = async (slug) => {
  try {
    const response = await axios.get(`${API_URI}/${slug}`);
    return response.data?.url;
  } catch (error) {
    console.log("Error while calling the API ", error.message);
    return error;
  }
};

export const uploadFile = async (url, file) => {
  try {
    const response = await axios.put(url, file, { headers: { "Content-Type": mime.lookup(file) } });
    return response;
  } catch (error) {
    console.log("Error while calling the API ", error.message);
    return error;
  }
};
