import Election from "../models/election.model.js";

export async function getUserDashboard(req, res) {
  try {
    /**Dashboard */

    const userData = res.user;

    const electionData = await Election.findOne({
      currentStatus: true,
    })
      .select(
        "electionName electionType electionStartDate electionResultsDate electionStatus currentStatus",
      )
      .populate("electionCandidates");

    res.status(200).json({
      status: "success",
      message: "User dashboard",
      data: electionData ? electionData : "No active election found",
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
}
