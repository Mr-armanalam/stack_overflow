'use server'
import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
   mongoose.set("strictQuery", true); // only allow query that match with schema
  console.log(process.env.NEXT_PUBLIC_MONGODB_URL);

  console.log (mongoose)

  if (!process.env.NEXT_PUBLIC_MONGODB_URL) {
    return console.log("Missing mongodb URL");
  }

  if (isConnected) {
    return console.log("Mongodb is already connected");
  }

  try {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URL, {
      dbName: "Stack_Overflow",
    });
    isConnected = true;
    console.log("MongoDB is Connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};
