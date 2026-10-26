import express from "express";
import mongoose from "mongoose";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import checkVoteStatus from "../middlewares/vote.middleware.js";
("../middlewares/vote.middleware.js");
import { getUserDashboard } from "../controllers/user.controller.js";
import Election from "../models/election.model.js";
import Candidate from "../models/candidate.model.js";

const router = express.Router();

router.get("/vote/:id", authenticateUser, checkVoteStatus, async (req, res) => {
  try {
    const candidateId = req.params?.id;
    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      throw new Error("Invalid candidate ID");
    }
    const candidateData = await Candidate.findById({ _id: candidateId });

    if (!candidateData) {
      throw new Error("Candidate not found to Vote");
    }
    console.log(candidateData);
    candidateData.votes += 1;
    console.log("After ", candidateData);
    const candidateVote = await candidateData.save();

    console.log("Saved candidate vote: ", candidateVote);
    const user = req.USER;
    user.voteStatus.status = true;
    const userSave = await user.save();
    console.log(userSave);

    res.status(200).json({
      status: "success",
      message: "Vote casted successfully",
    });
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
});

router.get("/view-results", authenticateUser, async (req, res) => {
  try {
    const electionResults = await Election.find({
      $nor: [{ electionWinner: null }],
    });
    // TODO
    if (!electionResults) {
      throw new Error("No election results found");
    }

    res.status(200).json({
      status: "success",
      data: electionResults ? electionResults : [],
    });
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
});

router.get("/username", authenticateUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    res.status(200).json({
      status: "success",
      data: loggedInUser.username,
    });
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
});

router.get("/dashboard", authenticateUser, getUserDashboard);

export default router;
