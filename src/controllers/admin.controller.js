import mongoose from "mongoose";
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

export async function getCandidateByName(req, res) {
  try {
    const candidateName = req.params?.name;
    if (!candidateName) {
      throw new Error("Candidate name is required");
    }

    const candidate_data = await Candidate.findOne({
      candidateName: candidateName,
    });

    if (!candidate_data) {
      throw new Error("Candidate not found");
    }

    res.status(200).json({ status: "success", message: candidate_data });
  } catch (error) {
    res.sttaus(400).json({ status: "failed", message: error.message });
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

export async function getElectionByName(req, res) {
  try {
    const electionName = req.params.name;
    if (!electionName) {
      throw new Error("Election name is required");
    }

    const election_data = await Election.findOne({
      electionName: electionName,
    });

    if (!election_data) {
      throw new Error("Election not found");
    }

    res.status(200).json({ status: "success", message: election_data });
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
}

export async function getTotalVotes(req, res) {
  try {
    const totalVotes = await User.countDocuments({
      voteStatus: { status: true },
    });

    if (totalVotes == null) {
      throw new Error("Error fetching total votes");
    }

    res.status(200).json({ status: "success", totalVotes: totalVotes });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
}

export async function deleteElectionByName(req, res) {
  try {
    const electionName = req.params.name;
    const deletedElection = await Election.findOneAndDelete({
      electionName: electionName,
    });
    if (!deletedElection) {
      throw new Error(`Election ${electionName} not found`);
    }
    res.status(200).json({
      status: "success",
      message: `Election ${electionName} deleted successfully`,
      data: deletedElection,
    });
  } catch (error) {
    res.status(404).json({ status: "failed", message: error.message });
  }
}

export async function updateElectionStatus(req, res) {
  try {
    const { name, status } = req.body;

    const election_data = await Election.findOne({ electionName: name });
    if (!election_data) {
      throw new Error(`Election ${name} not found`);
    }
    const updatedElection = await election_data.updateOne(
      { electionStatus: status },
      { new: true },
    );

    if (!updatedElection) {
      throw new Error(`Failed to update election ${name}`);
    }

    res.status(200).json({
      status: "success",
      message: `Election ${name} updated successfully`,
      data: updatedElection,
    });
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
}

/**
 * TASK
 * 1. Total number of elections -DONE
 * 2. CRUD operations for Candidates
 */

export async function getTotalElections(req, res) {
  try {
    const totalElections = await Election.countDocuments();

    if (totalElections == null) {
      throw new Error("Error fetching total elections");
    }

    res.status(200).json({ status: "success", totalElections: totalElections });
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
}

export async function updateCandidateByName(req, res) {
  try {
    const ALLOWED_FIELDS = [
      "candidateName",
      "candidateAge",
      "candidateGender",
      "candidateImageUrl",
      "partyName",
      "description",
    ];

    const candidateName = req.params?.name;
    if (!candidateName) {
      throw new Error("Candidate name is required");
    }

    Object.keys(req.body).forEach((key) => {
      if (!ALLOWED_FIELDS.includes(key)) {
        throw new Error(`Field ${key} is not allowed to be updated`);
      }
    });

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { candidateName: candidateName },
      req.body,
      { new: true },
    );

    if (!updatedCandidate) {
      throw new Error(`Failed to update candidate ${candidateName}`);
    }

    res.status(200).json({
      status: "success",
      message: `Candidate ${candidateName} updated successfully`,
      data: updatedCandidate,
    });
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
}

export async function deleteCandidateByName(req, res) {
  try {
    const candidateName = req.params?.name;
    if (!candidateName) {
      throw new Error("Candidate name is required");
    }

    const deletedCandidate = await Candidate.findOneAndDelete({
      candidateName: candidateName,
    });

    if (!deletedCandidate) {
      throw new Error(`Candidate ${candidateName} not found`);
    }

    res.status(200).json({
      status: "success",
      message: `Candidate ${candidateName} deleted successfully`,
      data: deletedCandidate,
    });
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
}
