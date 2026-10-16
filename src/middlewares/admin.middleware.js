import validator from "validator";

function isValidUrl(url) {
  return validator.isURL(url);
}

// Export middleware functions
/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function validateCandidateRegistrationFields(req, res, next) {
  try {
    const candidate = req.body;

    const fields = [
      "candidateName",
      "candidateAge",
      "candidateGender",
      "candidateImageUrl",
      "partyName",
      "description",
    ];

    Object.keys(candidate).forEach((key) => {
      if (!fields.includes(key)) {
        throw new Error(`Invalid field: ${key}`);
      }
    });
    if (
      candidate.candidateName === undefined ||
      candidate.candidateName === ""
    ) {
      throw new Error("candidateName is required");
    }
    if (candidate.candidateAge === undefined || candidate.candidateAge === "") {
      throw new Error("candidateAge is required");
    }
    if (
      candidate.candidateGender === undefined ||
      candidate.candidateGender === ""
    ) {
      throw new Error("candidateGender is required");
    }
    if (
      candidate.candidateImageUrl === undefined ||
      candidate.candidateImageUrl === ""
    ) {
      if (!isValidUrl(candidate.candidateImageUrl)) {
        throw new Error("candidateImageUrl is not a valid URL");
      }
      throw new Error("candidateImageUrl is required");
    }
    if (candidate.partyName === undefined || candidate.partyName === "") {
      throw new Error("partyName is required");
    }
    if (candidate.description === undefined || candidate.description === "") {
      throw new Error("description is required");
    }
    next();
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
}

export function validateElectionCreationFields(req, res, next) {
  try {
    const election = req.body;
    // electionName, electionType, electionCandidates[], electionStartDate, electionResultsDate
    const fields = [
      "electionName",
      "electionType",
      "electionCandidates",
      "electionStartDate",
      "electionResultsDate",
    ];

    Object.keys(election).forEach((key) => {
      if (!fields.includes(key)) {
        throw new Error(`Invalid field: ${key}`);
      }
    });

    if (
      election.electionCandidates &&
      !Array.isArray(election.electionCandidates)
    ) {
      throw new Error("electionCandidates must be an array");
    }

    next();
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
}
