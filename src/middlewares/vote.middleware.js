export default function checkVoteStatus(req, res, next) {
  try {
    const user = req.USER;
    if (!user) {
      throw new Error("User not found");
    }
    if (user.voteStatus.status) {
      throw new Error("Cannot vote again. You have already voted.");
    }
    next();
  } catch (error) {
    res.status(400).json({ status: "Failed", message: error.message });
  }
}
