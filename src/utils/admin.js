import Candidate from "../models/candidate.model.js";

/**
 * Extracts and finds candidates based on their IDs.
 * @param {Array} candidates
 * Requires bulk amount of candidates with ids to fetch from the DB
 * Requirs Only Candidate IDs to be passed in the array
 * @returns {Array} Array of candidate objects
 */
export async function extractAndFindCandidates(candidates) {
  const foundCandidates = [];
  candidates.forEach(async (candidate) => {
    const candidateExists = await Candidate.findById(candidate);
    // Do something with the found candidate, e.g., add it to a results array
    if (candidateExists) {
      foundCandidates.push(candidateExists);
    }
  });
  return foundCandidates;
}

