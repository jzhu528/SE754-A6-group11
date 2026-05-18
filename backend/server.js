const express = require('express');
const cors = require('cors');
const questions = require('./data/questions');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/questions', (req, res) => {
  res.json(questions);
});

app.get('/api/questions/:id', (req, res) => {
  const q = questions.find(q => q.id === parseInt(req.params.id));
  if (!q) return res.status(404).json({ error: 'Question not found' });
  res.json(q);
});

app.listen(PORT, () => {
  console.log(`Quiz server running at http://localhost:${PORT}`);
});
