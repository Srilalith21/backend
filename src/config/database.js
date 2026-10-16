import mongoose from "mongoose";
import config from "./config.js";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]); // Forces Cloudflare and Google DNS

export default async function connectDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Database connected successfully");
  } catch (err) {
    console.log("Error in connecting to database: ", err.message);
    throw new Error(`Error in connecting to database: ${err.message}`);
  }
}
