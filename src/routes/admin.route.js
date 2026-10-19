import express from "express";
import Admin from "../models/admin.model.js";
import Election from "../models/election.model.js";
import Candidate from "../models/candidate.model.js";
import User from "../models/user.model.js";
import { authenticateAdmin } from "../middlewares/auth.middleware.js";
import {
  validateCandidateRegistrationFields,
  validateElectionCreationFields,
} from "../middlewares/admin.middleware.js";
import {
  postCreateElection,
  postCreateCandidate,
  getElectionByName,
  getCandidateByName,
  getTotalVotes,
  deleteElectionByName,
  updateElectionStatus,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const admin = await Admin.create(req.body);

    if (!admin) {
      throw new Error("Admin registration failed");
    }

    res.status(201).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ adminEmail: email });

    if (!admin) {
      throw new Error("Invalid Credentials");
    }
    const isValidEmail = admin.adminEmail == email;
    const isValidPassword = admin.adminPassword == password;

    if (!isValidEmail) {
      throw new Error("Invalid Credentials");
    }

    if (!isValidPassword) {
      throw new Error("Invalid Credentials");
    }

    const adminToken = await admin.generateAuthToken();

    res.cookie("adminToken", adminToken, { maxAge: 3600000 });
    res
      .status(200)
      .json({ status: "success", message: "Admin login successful" });
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
});

router.get("/logout", (req, res) => {
  res.cookie("adminToken", "", { maxAge: 0 });
  res.json({ status: "success", message: "Admin logged out successfully" });
});

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

router.post(
  "/create-election",
  authenticateAdmin,
  validateElectionCreationFields,
  postCreateElection,
);

router.post(
  "/create-candidate",
  authenticateAdmin,
  validateCandidateRegistrationFields,
  postCreateCandidate,
);

router.get("/view-election/:name", authenticateAdmin, getElectionByName);

router.get("/view-candidate/:name", authenticateAdmin, getCandidateByName);

router.get("/view-total-votes", authenticateAdmin, getTotalVotes);

router.delete(
  "/delete-election/:name",
  authenticateAdmin,
  deleteElectionByName,
);

router.patch(
  "/update-election-status",
  authenticateAdmin,
  updateElectionStatus,
);

export default router;
