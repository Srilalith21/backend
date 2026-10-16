import mongoose from "mongoose";
import validator from "validator";

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
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "elections",
    },
  },
  { timestamps: true },
);

const Admin = mongoose.model("admin", adminSchema);

export default Admin;
