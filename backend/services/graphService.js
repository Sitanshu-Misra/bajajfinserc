class UnionFind {
  constructor() {
    this.parent = {};
    this.rank = {};
  }

  makeSet(x) {
    if (this.parent[x] === undefined) {
      this.parent[x] = x;
      this.rank[x] = 0;
    }
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    this.makeSet(x);
    this.makeSet(y);
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) return;
    if (this.rank[rx] < this.rank[ry]) {
      this.parent[rx] = ry;
    } else if (this.rank[rx] > this.rank[ry]) {
      this.parent[ry] = rx;
    } else {
      this.parent[ry] = rx;
      this.rank[rx]++;
    }
  }
}

function buildGraph(uniqueEdges) {
  const parentMap = {};
  const childrenMap = {};
  const allNodes = new Set();
  const acceptedEdges = [];

  for (const edge of uniqueEdges) {
    const [p, c] = edge.split('->');

    if (parentMap[c] !== undefined) continue;

    allNodes.add(p);
    allNodes.add(c);
    parentMap[c] = p;
    if (!childrenMap[p]) childrenMap[p] = [];
    childrenMap[p].push(c);
    acceptedEdges.push({ parent: p, child: c });
  }

  return { parentMap, childrenMap, allNodes, acceptedEdges };
}

function findComponents(allNodes, acceptedEdges) {
  const uf = new UnionFind();
  for (const node of allNodes) uf.makeSet(node);
  for (const { parent, child } of acceptedEdges) uf.union(parent, child);

  const components = {};
  for (const node of allNodes) {
    const rep = uf.find(node);
    if (!components[rep]) components[rep] = [];
    components[rep].push(node);
  }

  const seen = new Set();
  const ordered = [];
  for (const { parent } of acceptedEdges) {
    const rep = uf.find(parent);
    if (!seen.has(rep)) {
      seen.add(rep);
      ordered.push(rep);
    }
  }

  return ordered.map(rep => components[rep]);
}

function buildTreeObj(root, childrenMap) {
  function recurse(node) {
    const children = (childrenMap[node] || []).sort();
    const obj = {};
    for (const child of children) {
      obj[child] = recurse(child);
    }
    return obj;
  }
  return { [root]: recurse(root) };
}

function calculateDepth(root, childrenMap) {
  function dfs(node) {
    const children = childrenMap[node] || [];
    if (children.length === 0) return 1;
    let max = 0;
    for (const child of children) {
      max = Math.max(max, dfs(child));
    }
    return 1 + max;
  }
  return dfs(root);
}

function processHierarchies(uniqueEdges) {
  const { parentMap, childrenMap, allNodes, acceptedEdges } = buildGraph(uniqueEdges);

  if (allNodes.size === 0) return [];

  const components = findComponents(allNodes, acceptedEdges);
  const hierarchies = [];

  for (const nodes of components) {
    const roots = nodes.filter(n => parentMap[n] === undefined);

    if (roots.length === 0) {
      const root = nodes.sort()[0];
      hierarchies.push({ root, tree: {}, has_cycle: true });
    } else {
      const root = roots[0];
      const tree = buildTreeObj(root, childrenMap);
      const depth = calculateDepth(root, childrenMap);
      hierarchies.push({ root, tree, depth });
    }
  }

  return hierarchies;
}

function computeSummary(hierarchies) {
  const trees = hierarchies.filter(h => !h.has_cycle);
  const cycles = hierarchies.filter(h => h.has_cycle);

  let largestTreeRoot = "";
  let maxDepth = 0;

  for (const t of trees) {
    if (t.depth > maxDepth || (t.depth === maxDepth && (largestTreeRoot === "" || t.root < largestTreeRoot))) {
      maxDepth = t.depth;
      largestTreeRoot = t.root;
    }
  }

  return {
    total_trees: trees.length,
    total_cycles: cycles.length,
    largest_tree_root: largestTreeRoot
  };
}

module.exports = { processHierarchies, computeSummary };
