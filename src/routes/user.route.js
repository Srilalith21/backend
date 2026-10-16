/**
 * /dashboard
 * /view-results
 * /edit/me
 * /profile
 */
import express from "express";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import checkVoteStatus from "../middlewares/vote.middleware.js";
("../middlewares/vote.middleware.js");
import User from "../models/user.model.js";

const router = express.Router();

router.get("/user-dashboard", authenticateUser, (req, res) => {
  try {
    /**
     * Requirements
     * 1. User Votes count
     * 2. User Profile Such as (name,age,mobile,email)
     * 3. User Role
     * 4. User Voter ID
     * 5. User Election Status
     */

    // Later Add the data Total Candidates, Total Parties (ADD THIS IN DIFFERENT ROUTE)
    const userData = {
      userName: req.user.userName,
      age: req.user.age,
      email: req.user.email,
      mobile: req.user.mobile,
      voterId: req.user.voterId,
      role: req.user.role,
      voteStatus: req.user.voteStatus,
    };

    res
      .status(200)
      .json({ status: "success", message: "User dashboard", data: userData });
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
});

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
    // TODO : Implement the logic to fetch and retund the election results from the database
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
});

export default router;
