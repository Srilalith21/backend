import express from "express";
import bcrypt from "bcrypt";
/**
 * Importing Models
 */
import User from "../models/user.model.js";
import { validateRegistrationFields } from "../utils/validate.js";
import { validateLoginFields } from "../middlewares/auth.middleware.js";
import generateJWTToken from "../utils/authentication.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    validateRegistrationFields(req);
    const user = new User();

    user.userName = req.body.userName;
    user.age = req.body.age;
    user.email = req.body.email;
    user.mobile = req.body.mobile;
    user.voterId = req.body.voterId;
    user.password = await user.hashPassword(req.body.password);
    user.role = req.body.role || "user"; // Default role is "user" if not provided

    await user.save();

    res.status(201).json({ status: "success", data: user });
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
});

router.post("/login", validateLoginFields, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }
    const token = generateJWTToken(user._id);

    res.cookie("token", token, { maxAge: 3600000 }); // 1 hour

    res.status(200).json({ status: "success", message: "Login successful" });
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ status: "success", message: "Logout successful" });
});

export default router;
