import express from "express";
import cookieParser from "cookie-parser";

import connectDB from "./config/database.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import config from "./config/config.js";

const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies

/**
 * Stitching the routes to the main app
 */
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  console.log(req)
  res.json({ message: "Welcome to the Online Voting System API" });
});

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/api/admin", adminRoute);

connectDB()
  .then(() => {
    app.listen(config.PORT, () => {
      console.log(`Server is running on port : ${config.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database :", err.message);
  });
