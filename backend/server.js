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

app.post('/api/quiz/submit', (req, res) => {
  const responses = req.body?.responses;

  if (!Array.isArray(responses)) {
    return res.status(400).json({ error: 'responses must be an array' });
  }

  const results = responses.map((response, index) => {
    const question = questions.find(q => q.id === Number(response.questionId));
    if (!question) {
      return {
        questionId: response.questionId,
        position: index + 1,
        isCorrect: false,
        error: 'Question not found'
      };
    }

    const correctOption = question.options[question.correctIndex];
    const selectedOption = response.selectedOption ?? null;
    const selectedIndex = selectedOption === null ? -1 : question.options.indexOf(selectedOption);
    const isCorrect = selectedOption === correctOption;

    return {
      questionId: question.id,
      position: index + 1,
      topic: question.topic,
      question: question.question,
      selectedOption,
      selectedIndex,
      correctOption,
      correctIndex: question.correctIndex,
      isCorrect,
      explanation: question.explanation
    };
  });

  const score = results.filter(result => result.isCorrect).length;
  const answeredCount = results.filter(result => result.selectedOption !== null).length;

  res.json({
    score,
    total: results.length,
    answeredCount,
    skippedCount: results.length - answeredCount,
    results
  });
});

app.listen(PORT, () => {
  console.log(`Quiz server running at http://localhost:${PORT}`);
});
