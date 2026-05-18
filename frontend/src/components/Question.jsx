import ProgressBar from './ProgressBar';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function Question({ question, total, index, onAnswer, answered }) {
  const { topic, question: text, options, correctIndex } = question;
  const isAnswered = answered !== null;

  function getOptionClass(i) {
    if (!isAnswered) return '';
    if (i === correctIndex) return answered === i ? 'correct' : 'revealed';
    if (i === answered && answered !== correctIndex) return 'wrong';
    return '';
  }

  return (
    <div>
      <ProgressBar current={index + 1} total={total} />
      <span className="topic-tag" aria-label={`Topic: ${topic}`}>{topic}</span>
      <p className="question-number">Question {index + 1}</p>
      <h2 className="question-text">{text}</h2>

      <ul className="options-list" role="list">
        {options.map((opt, i) => (
          <li key={i}>
            <button
              className={`option-btn ${getOptionClass(i)}`}
              onClick={() => !isAnswered && onAnswer(i)}
              disabled={isAnswered}
              aria-pressed={answered === i}
              aria-label={`Option ${LETTERS[i]}: ${opt}`}
            >
              <span className="option-letter" aria-hidden="true">{LETTERS[i]}</span>
              <span>{opt}</span>
            </button>
          </li>
        ))}
      </ul>

      {isAnswered && (
        <div
          className={`feedback-box ${answered === correctIndex ? 'correct' : 'wrong'}`}
          role="alert"
          aria-live="assertive"
        >
          <div className="feedback-title">
            {answered === correctIndex
              ? <><span aria-hidden="true">✅</span> Correct! Well done!</>
              : <><span aria-hidden="true">❌</span> Not quite — the correct answer is {LETTERS[correctIndex]}.</>
            }
          </div>
          <p className="feedback-explanation">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
