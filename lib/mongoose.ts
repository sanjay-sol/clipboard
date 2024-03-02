import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async (): Promise<void> => {
  try {
    const MONGO_URL: string | undefined = process.env.MONGO_URL;

    if (!MONGO_URL) {
      console.log("MongoDB URL not found");
      return;
    }

    if (isConnected) {
      console.log("Already connected to MongoDB");
      return;
    } else {
      await mongoose.connect(MONGO_URL);
      isConnected = true;
      console.log("Connected to MongoDB");
    }
  } catch (err: any) {
    console.log("Error connecting to MongoDB:", err);
  }
};
