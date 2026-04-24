const express = require('express');
const cors = require('cors');
const bfhlRoutes = require('./routes/bfhl');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/', bfhlRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'BFHL API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
