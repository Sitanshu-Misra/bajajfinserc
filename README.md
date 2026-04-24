# BFHL — Graph Hierarchy Analyzer

Full-stack application for the **SRM Full Stack Engineering Challenge (Bajaj Finserv Health)**.

Accepts an array of directed edge strings (`X->Y`), validates them, builds hierarchical trees, detects cycles, and returns structured JSON with a visual frontend.

---

## 🚀 Live URLs

| Service  | URL |
|----------|-----|
| Backend  | `https://your-backend.onrender.com` |
| Frontend | `https://your-frontend.vercel.app` |

---

## 📌 API Specification

### `POST /bfhl`

**Request:**
```json
{
  "data": ["A->B", "A->C", "B->D", "C->E", "E->F", "X->Y", "Y->Z", "Z->X"]
}
```

**Response:**
```json
{
  "user_id": "sitanshumisra_ddmmyyyy",
  "email_id": "sm1234@srmist.edu.in",
  "college_roll_number": "RA2211003010XXX",
  "hierarchies": [
    {
      "root": "A",
      "tree": { "A": { "B": { "D": {} }, "C": { "E": { "F": {} } } } },
      "depth": 4
    },
    {
      "root": "X",
      "tree": {},
      "has_cycle": true
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 1,
    "largest_tree_root": "A"
  }
}
```

---

## 🏗️ Project Structure

```
bajaj-finserv/
├── backend/
│   ├── config/
│   │   └── identity.js          # User credentials (update before deploy)
│   ├── controllers/
│   │   └── bfhlController.js    # Request handler
│   ├── routes/
│   │   └── bfhl.js              # Route definitions
│   ├── services/
│   │   └── graphService.js      # Core graph algorithms
│   ├── utils/
│   │   └── validator.js         # Input validation & deduplication
│   ├── server.js                # Express server entry
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── bfhlApi.js       # API client
│   │   ├── components/
│   │   │   ├── SummaryCards.jsx  # Dashboard summary cards
│   │   │   ├── TreeView.jsx     # Interactive tree visualization
│   │   │   └── EntryLists.jsx   # Invalid & duplicate entry display
│   │   ├── App.jsx              # Main application
│   │   ├── main.jsx             # React entry
│   │   └── index.css            # Global styles + Tailwind
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## ⚙️ Processing Rules

1. **Validation** — Only `X->Y` where X, Y are single uppercase letters (A–Z). Rejects self-loops, multi-char nodes, wrong format.
2. **Deduplication** — First occurrence used; duplicates listed once in `duplicate_edges`.
3. **Multi-parent** — First parent edge wins; subsequent edges for same child silently discarded.
4. **Cycle Detection** — Connected components with no root node contain cycles → `has_cycle: true`, `tree: {}`.
5. **Depth** — Node count on longest root-to-leaf path.
6. **Summary** — `largest_tree_root` tiebreaker is lexicographically smaller root.

---

## 🛠️ Local Development

### Backend
```bash
cd backend
npm install
npm run dev        # runs on http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev        # runs on http://localhost:5173
```

The frontend dev server proxies `/bfhl` to `localhost:3001` automatically.

---

## 🚀 Deployment

### Backend → Render
1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variable `PORT=3001` (Render auto-sets this)

### Frontend → Vercel
1. Import repo on [Vercel](https://vercel.com)
2. Set root directory to `frontend`
3. Framework preset: **Vite**
4. Add env variable: `VITE_API_URL=https://your-backend.onrender.com`
5. Deploy

### CORS
CORS is enabled on the backend via the `cors` package with default settings (allows all origins).

---

## 🧪 Test Cases

| Input | Expected |
|-------|----------|
| `["A->B"]` | 1 tree, depth 2, root A |
| `["A->B", "A->B"]` | 1 tree + duplicate_edges: ["A->B"] |
| `["A->B", "B->A"]` | 1 cycle, root A |
| `["hello", "1->2", ""]` | 3 invalid, 0 hierarchies |
| `["A->A"]` | 1 invalid (self-loop) |
| `["A->B", "C->B"]` | 1 tree (C->B discarded, multi-parent) |
| `["X->Y", "Y->Z", "Z->X"]` | 1 cycle, root X |
| `[]` | empty hierarchies, 0 trees, 0 cycles |

---

## 📝 Configuration

Update `backend/config/identity.js` with your real credentials before deployment:

```javascript
module.exports = {
  user_id: "yourname_ddmmyyyy",
  email_id: "your.email@college.edu",
  college_roll_number: "YOUR_ROLL_NUMBER"
};
```
