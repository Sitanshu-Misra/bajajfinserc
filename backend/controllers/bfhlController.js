const identity = require('../config/identity');
const { validateEntries, deduplicateEdges } = require('../utils/validator');
const { processHierarchies, computeSummary } = require('../services/graphService');

function handlePost(req, res) {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: "Request body must contain a 'data' array." });
    }

    const { validEdges, invalidEntries } = validateEntries(data);
    const { uniqueEdges, duplicateEdges } = deduplicateEdges(validEdges);
    const hierarchies = processHierarchies(uniqueEdges);
    const summary = computeSummary(hierarchies);

    return res.json({
      user_id: identity.user_id,
      email_id: identity.email_id,
      college_roll_number: identity.college_roll_number,
      hierarchies,
      invalid_entries: invalidEntries,
      duplicate_edges: duplicateEdges,
      summary
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = { handlePost };
