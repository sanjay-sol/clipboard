import axios from "axios";
const headers = {
  "Content-Type": "multipart/form-data",
};

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
    const response = await axios.put(url, file, { headers: headers });
    return response;
  } catch (error) {
    console.log("Error while calling the API--- ", error.message);
    return error;
  }
};