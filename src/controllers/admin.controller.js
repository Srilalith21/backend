import Candidate from "../models/candidate.model.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import Election from "../models/election.model.js";

export async function postCreateCandidate(req, res) {
  try {
    const {
      candidateName,
      candidateAge,
      candidateGender,
      candidateImageUrl,
      partyName,
      description,
    } = req.body;
    const candidate = await Candidate.create({
      candidateName,
      candidateAge,
      candidateGender,
      candidateImageUrl,
      partyName,
      description,
    });

    if (!candidate) {
      throw new Error("Candidate creation failed");
    }

    res.status(201).json({ status: "success", data: candidate });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ status: "failed", message: "Duplicate candidate entry" });
    }

    if (error.message.includes("Candidate validation failed")) {
      return res.status(501).json({ status: "failed", message: error.message });
    }
    res.status(400).json({ status: "failed", message: error.message });
  }
}

export async function postCreateElection(req, res) {
  try {
    const election = req.body;
    const newElection = await Election.create(election);
    if (!newElection) {
      throw new Error("Election creation failed");
    }
    res.status(201).json({ status: "success", data: newElection });
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
}
