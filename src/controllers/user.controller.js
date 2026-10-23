import Election from "../models/election.model.js";
import Candidate from "../models/candidate.model.js";

export async function getUserDashboard(req, res) {
  try {
    /**Dashboard */

    const userData = req.USER;

    const electionData = await Election.findOne({
      currentStatus: true,
    })
      .select(
        "electionName electionType electionStartDate electionResultsDate electionStatus currentStatus",
      )
      .populate("electionCandidates");

    const candidateCount = await Candidate.countDocuments({});
    if (!candidateCount) {
      return res.status(404).json({
        status: "failed",
        message: "No candidates found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User dashboard",
      candidateCount: candidateCount,
      userData: userData ? userData : "No user data found",
      electionData: electionData ? electionData : "No active election found",
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
}
