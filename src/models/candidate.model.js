import mongoose from "mongoose";
import validator from "validator";

const candidateSchema = new mongoose.Schema(
  {
    candidateName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    candidateAge: {
      type: Number,
      required: true,
      validate: (age) => {
        if (age < 18) {
          throw new Error("Age must be greater than or equal to 18");
        }
      },
    },
    candidateGender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    candidateImageUrl: {
      type: String,
      required: true,
      validate: (value) => {
        const url = validator.isURL(value);
        if (!url) {
          throw new Error("Invalid URL");
        }
      },
      unique: true,
    },
    partyName: { type: String, required: true, unique: true, lowercase: true },
    votes: { type: Number, default: 0 },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

const Candidate = mongoose.model("candidates", candidateSchema);

export default Candidate;
