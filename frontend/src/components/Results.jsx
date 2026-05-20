function getScoreClass(score, total) {
  if (total === 0) return 'keep-going';
  const pct = score / total;
  if (pct >= 0.8) return 'great';
  if (pct >= 0.5) return 'good';
  return 'keep-going';
}

function getScoreMessage(score, total) {
  if (total === 0) return 'No quiz questions were submitted.';
  const pct = score / total;
  if (pct >= 0.8) return 'Excellent work! You have a strong understanding of Java OOP.';
  if (pct >= 0.5) return 'Good effort! Review the questions you missed and try again.';
  return 'Keep going! Practice makes perfect — try the quiz again.';
}

export default function Results({ questions, answers, result, onRetry }) {
  const score = result?.score ?? answers.filter((a, i) => a === questions[i].correctIndex).length;
  const total = result?.total ?? questions.length;
  const cls = getScoreClass(score, total);
  const reviewItems = result?.results ?? questions.map((q, i) => {
    const wasAnswered = answers[i] !== null && answers[i] !== undefined;
    return {
      questionId: q.id,
      question: q.question,
      selectedOption: wasAnswered ? q.options[answers[i]] : null,
      correctOption: q.options[q.correctIndex],
      isCorrect: wasAnswered && answers[i] === q.correctIndex
    };
  });

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
        {reviewItems.map((item, i) => {
          const wasAnswered = item.selectedOption !== null && item.selectedOption !== undefined;
          return (
            <div key={item.questionId ?? i} className="breakdown-item">
              <span className="status-icon" aria-hidden="true">{item.isCorrect ? '✅' : '❌'}</span>
              <div>
                <div className="item-q">Q{i + 1}: {item.question}</div>
                {!item.isCorrect && (
                  <div style={{ fontSize: '0.88rem', color: '#6b7280', marginTop: 2 }}>
                    Your answer: {wasAnswered ? item.selectedOption : 'Skipped'} — Correct: {item.correctOption}
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
