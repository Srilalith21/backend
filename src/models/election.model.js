import mongoose from "mongoose";
import validator from "validator";

const electionSchema = new mongoose.Schema(
  {
    electionName: {
      type: String,
      required: true,
      unique: true,
    },
    electionType: {
      type: String,
      required: true,
      enum: ["general", "local", "state"],
    },
    electionCandidates: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "candidates",
      default: [],
    },
    electionStartDate: { type: String, required: true },
    electionResultsDate: { type: String, required: true },
    electionWinner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "candidates",
      default: null,
    },
    electionStatus: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
  },
  { timestamps: true },
);

const Election = mongoose.model("elections", electionSchema);

export default Election;
