import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
    // mongoose.set('strictQuery', true);
    if(!process.env.MONGO_URL) return console.log("MongoDB url not found");

    if(isConnected) return console.log("Already connected to MongoDB");

    try {
        await mongoose.connect(process.env.MONGO_URL);
        isConnected = true;
        console.log("Connected to MongoDB");
    }catch(err){
        console.log(err+"Error connecting to MongoDB");
    }

}