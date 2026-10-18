import validator from "validator";
import jwt from "jsonwebtoken";

import config from "../config/config.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";

export async function validateLoginFields(req, res, next) {
  try {
    const data = req.body;
    if (Object.keys(data).length > 2) {
      throw new Error("Extra fields are not allowed");
    }
    if (validator.isEmpty(data.email) || !validator.isEmail(data.email)) {
      throw new Error("Email is required");
    }
    if (validator.isEmpty(data.password)) {
      throw new Error("Password is required");
    }

    const loggedInUser = await User.findOne({ email: data.email });
    if (!loggedInUser) {
      throw new Error("Invalid Credentials");
    }
    req.user = loggedInUser;
    next();
  } catch (error) {
    res.status(400).json({ status: "Failed", message: error.message });
  }
}

export async function authenticateUser(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res
        .status(401)
        .json({ status: "Failed", message: "Unauthorized" });
    }
    // Extract and Decode cookie
    const decodedCookie = jwt.verify(token, config.SECRET_KEY);
    if (!decodedCookie || !decodedCookie.id) {
      throw new Error("Invalid token");
    }

    const loggedInUserData = await User.findById(decodedCookie.id);
    if (!loggedInUserData) {
      throw new Error("User not found");
    }

    req.user = loggedInUserData;

    next();
  } catch (error) {
    res.status(401).json({ status: "Failed", message: error.message });
  }
}

export async function authenticateAdmin(req, res, next) {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res
        .status(401)
        .json({ status: "Failed", message: "Unauthorized" });
    }

    const decodedCookie = jwt.verify(token, config.SECRET_KEY);
    if (!decodedCookie || !decodedCookie._id) {
      throw new Error("Invalid token");
    }

    const fetchAdminData = await Admin.findById(decodedCookie._id);
    if (!fetchAdminData) {
      throw new Error("Admin not found");
    }
    req.admin = fetchAdminData;
    next();
  } catch (error) {
    res.status(403).json({ status: "Failed", message: error.message });
  }
}
