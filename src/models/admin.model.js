import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const adminSchema = new mongoose.Schema(
  {
    adminName: {
      type: String,
      required: true,
      unique: true,
    },
    adminEmail: {
      required: true,
      type: String,
      validate: (email) => {
        if (!validator.isEmail(email)) {
          throw new Error("Invalid email address");
        }
      },
      unique: true,
    },
    adminPassword: {
      type: String,
      required: true,
      validate: (password) => {
        if (!validator.isStrongPassword(password)) {
          throw new Error(
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
          );
        }
      },
    },
    adminPasskey: {
      type: String,
      required: true,
    },
    adminAge: {
      type: Number,
      required: true,
      validate: (age) => {
        if (age < 18) {
          throw new Error("Age must be greater than or equal to 18");
        }
      },
    },
    adminMobile: {
      type: String,
    },
  },
  { timestamps: true },
);

adminSchema.methods.generateAuthToken = async function () {
  const admin = this;

  const token = jwt.sign({ _id: admin._id.toString() }, config.SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
};

const Admin = mongoose.model("admin", adminSchema);

export default Admin;
