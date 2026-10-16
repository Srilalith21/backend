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
    },
    electionStartDate: { type: Date, required: true },
    electionResultsDate: { type: Date, required: true },
    electionWinner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "candidates",
    },
  },
  { timestamps: true },
);

const Election = mongoose.model("elections", electionSchema);

export default Election;
