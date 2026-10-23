import Election from "../models/election.model.js";

export async function getUserDashboard(req, res) {
  try {
    /**Dashboard */

    const userData = req.USER;
    console.log("User Data:", userData);

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
