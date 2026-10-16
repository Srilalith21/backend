import express from "express";
import Admin from "../models/admin.model.js";
import Election from "../models/election.model.js";
import Candidate from "../models/candidate.model.js";
import User from "../models/user.model.js";

import { authenticateAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", authenticateAdmin, async (req, res) => {
  /**
   * Dashboard contents
   * 1. Total number of elections
   * 2. Total number of candidates
   * 3. Total number of votes cast
   * 4. Total number of registered voters
   */

  try {
    const totalElections = await Election.countDocuments();
    const totalCandidates = await Candidate.countDocuments();
    const totalVotes = await User.countDocuments(
      User.find({ voteStatus: { status: true } }),
    );
    const totalVoters = await User.countDocuments();
    console.log(totalVoters, totalVotes, totalCandidates, totalElections);
    const dashboardData = {
      totalElections,
      totalCandidates,
      totalVotes,
      totalVoters,
    };
    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
});

router.get("/create-election", authenticateAdmin, (req, res) => {
  // Logic for creating an election

  res.json({ message: "create election" });
});

/**
 * ROUTES TO BE CREATED
 *
 * /create-election
 * /insert-candidate
 * /view-election by ID
 * /view-candidate by ID
 * /view-election-results by ID
 * /view-election-results-by-candidate
 * /view-votes-per-candidate
 * /view-votes-per-election
 */

export default router;
