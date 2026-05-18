const LETTERS = ['A', 'B', 'C', 'D'];

function getScoreClass(score, total) {
  const pct = score / total;
  if (pct >= 0.8) return 'great';
  if (pct >= 0.5) return 'good';
  return 'keep-going';
}

function getScoreMessage(score, total) {
  const pct = score / total;
  if (pct >= 0.8) return 'Excellent work! You have a strong understanding of Java OOP.';
  if (pct >= 0.5) return 'Good effort! Review the questions you missed and try again.';
  return 'Keep going! Practice makes perfect — try the quiz again.';
}

export default function Results({ questions, answers, onRetry }) {
  const score = answers.filter((a, i) => a === questions[i].correctIndex).length;
  const total = questions.length;
  const cls = getScoreClass(score, total);

  return (
    <div className="results-screen">
      <div className={`score-circle ${cls}`} role="img" aria-label={`Score: ${score} out of ${total}`}>
        <span className="score-number">{score}/{total}</span>
        <span className="score-label">Score</span>
      </div>

      <h2 className="results-heading">Quiz Complete!</h2>
      <p className="results-msg">{getScoreMessage(score, total)}</p>

      <div className="results-breakdown" role="region" aria-label="Answer review">
        <div className="breakdown-header">Your Answers — Review</div>
        {questions.map((q, i) => {
          const isCorrect = answers[i] === q.correctIndex;
          return (
            <div key={q.id} className="breakdown-item">
              <span className="status-icon" aria-hidden="true">{isCorrect ? '✅' : '❌'}</span>
              <div>
                <div className="item-q">Q{i + 1}: {q.question}</div>
                {!isCorrect && (
                  <div style={{ fontSize: '0.88rem', color: '#6b7280', marginTop: 2 }}>
                    Your answer: {LETTERS[answers[i]]} — Correct: {LETTERS[q.correctIndex]}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="results-btn-group">
        <button
          className="btn btn-primary"
          onClick={onRetry}
          aria-label="Retake the quiz from the beginning"
        >
          <span aria-hidden="true">🔄</span> Retake Quiz
        </button>
      </div>
    </div>
  );
}
