import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to backend/.env
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

if (!process.env.SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in the environment variables");
}

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}
if (!process.env.PORT) {
  throw new Error("PORT is not defined in the environment variables");
}

export default {
  SECRET_KEY: process.env.SECRET_KEY,
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 4040,
};
