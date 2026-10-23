import express from "express";
import cookieParser from "cookie-parser";

import connectDB from "./config/database.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import config from "./config/config.js";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
); // Enable CORS for all routes

app.use(morgan("dev")); // Logging middleware
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies

/**
 * Stitching the routes to the main app
 */
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/api/admin", adminRoute);

app.use((req, res) => {
  res.status(404).json({
    status: "failed",
    message: "Route not found",
    requestedUrl: req.originalUrl,
  });
});

connectDB()
  .then(() => {
    app.listen(config.PORT, () => {
      console.log(`Server is running on port : ${config.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database :", err.message);
  });
