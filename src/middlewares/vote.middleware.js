export default function checkVoteStatus(req, res, next) {
  try {
    const user = req.user;

    if (user.voteStatus) {
      throw new Error("Cannot vote again. You have already voted.");
    }
    next();
  } catch (error) {
    res.status(400).json({ status: "Failed", message: error.message });
  }
}
