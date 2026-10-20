import express from "express";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import checkVoteStatus from "../middlewares/vote.middleware.js";
("../middlewares/vote.middleware.js");
import { getUserDashboard } from "../controllers/user.controller.js";
import Election from "../models/election.model.js";

const router = express.Router();

router.post(
  "/vote/:candidateId",
  authenticateUser,
  checkVoteStatus,
  async (req, res) => {
    try {
      /**
       * TODO: Implement the voting logic here
       * fetch the candidateID from the DB and then add the vote to the candidate and update the user
       */

      // CUSTOM DATA
      const candidateDetails = {
        candidateId: 11212,
        candidateName: "Elon Musk",
        partyName: "Democratic Party",
        voteCount: 10,
        candidaeGender: "Male",
        candidateUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-rNtvrUnGruyUXyNqWz-jC3f1fpo78wvb0j9AfzTEAnbOtvlMekqLJQEU-e8yky_Ytq3EL6zjJrEKaSlkBU_vEV46FL6NPNO4gqAbUdg&s=10",
      };
      candidateDetails.voteCount += 1;
      const loggedInUser = req.user;
      loggedInUser.voteStatus = true;

      const updatedUser = await loggedInUser.save();
      console.log("Updated User:", updatedUser);
      res.status(200).json({
        status: "success",
        message: "Vote casted successfully",
      });
    } catch (error) {
      res.status(400).json({ status: "failed", message: error.message });
    }
  },
);

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

router.get("username", authenticateUser, async (req, res) => {
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
