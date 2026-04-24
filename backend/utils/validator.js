const EDGE_REGEX = /^[A-Z]->[A-Z]$/;

function validateEntries(data) {
  const validEdges = [];
  const invalidEntries = [];

  for (const entry of data) {
    const raw = String(entry);
    const trimmed = raw.trim();

    if (trimmed === '' || !EDGE_REGEX.test(trimmed)) {
      invalidEntries.push(raw);
      continue;
    }

    const [parent, child] = trimmed.split('->');
    if (parent === child) {
      invalidEntries.push(raw);
      continue;
    }

    validEdges.push(trimmed);
  }

  return { validEdges, invalidEntries };
}

function deduplicateEdges(edges) {
  const seen = new Set();
  const unique = [];
  const duplicateSet = new Set();

  for (const edge of edges) {
    if (seen.has(edge)) {
      duplicateSet.add(edge);
    } else {
      seen.add(edge);
      unique.push(edge);
    }
  }

  return { uniqueEdges: unique, duplicateEdges: Array.from(duplicateSet) };
}

module.exports = { validateEntries, deduplicateEdges };
