import { useState, useEffect } from 'react';
import Question from './components/Question';
import Results from './components/Results';

const PHASE = { START: 'start', QUIZ: 'quiz', RESULTS: 'results' };

export default function App() {
  const [phase, setPhase] = useState(PHASE.START);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answered, setAnswered] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadQuestions() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/questions');
      if (!res.ok) throw new Error('Failed to load questions');
      const data = await res.json();
      setQuestions(data);
    } catch (e) {
      setError('Could not load questions. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuestions();
  }, []);

  function startQuiz() {
    setCurrentIndex(0);
    setAnswers([]);
    setAnswered(null);
    setPhase(PHASE.QUIZ);
  }

  function handleAnswer(optionIndex) {
    setAnswered(optionIndex);
  }

  function handleNext() {
    const newAnswers = [...answers, answered];
    if (currentIndex + 1 >= questions.length) {
      setAnswers(newAnswers);
      setPhase(PHASE.RESULTS);
    } else {
      setAnswers(newAnswers);
      setCurrentIndex(currentIndex + 1);
      setAnswered(null);
    }
  }

  function handleRetry() {
    setCurrentIndex(0);
    setAnswers([]);
    setAnswered(null);
    setPhase(PHASE.START);
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex + 1 >= questions.length;

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>Java OOP Quiz</h1>
        <p>Learn Object-Oriented Programming step by step</p>
      </header>

      <main className="card" role="main">
        {loading && (
          <div className="loading-screen" aria-live="polite" aria-busy="true">
            <div className="loading-spinner" role="status" aria-label="Loading questions" />
            <p>Loading questions...</p>
          </div>
        )}

        {error && (
          <div className="error-box" role="alert">
            <p><strong>Error:</strong> {error}</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={loadQuestions}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && phase === PHASE.START && (
          <div className="start-screen">
            <span className="icon" aria-hidden="true">☕</span>
            <h2>Ready to test your Java OOP knowledge?</h2>
            <p>This quiz covers key Object-Oriented Programming concepts in Java.</p>
            <p>Take your time — there is no time limit.</p>
            <ul className="info-list" aria-label="Quiz information">
              <li>
                <span className="bullet" aria-hidden="true">📝</span>
                <span>{questions.length} multiple-choice questions</span>
              </li>
              <li>
                <span className="bullet" aria-hidden="true">💡</span>
                <span>Instant feedback after each answer</span>
              </li>
              <li>
                <span className="bullet" aria-hidden="true">🔄</span>
                <span>Retake the quiz as many times as you like</span>
              </li>
              <li>
                <span className="bullet" aria-hidden="true">🏆</span>
                <span>See your score and review at the end</span>
              </li>
            </ul>
            <button
              className="btn btn-primary"
              onClick={startQuiz}
              aria-label="Start the Java OOP quiz"
            >
              <span aria-hidden="true">▶</span> Start Quiz
            </button>
          </div>
        )}

        {!loading && !error && phase === PHASE.QUIZ && currentQuestion && (
          <div>
            <Question
              question={currentQuestion}
              total={questions.length}
              index={currentIndex}
              onAnswer={handleAnswer}
              answered={answered}
            />
            {answered !== null && (
              <div className="btn-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleNext}
                  aria-label={isLastQuestion ? 'Finish quiz and see results' : 'Go to next question'}
                >
                  {isLastQuestion
                    ? <><span aria-hidden="true">🏁</span> Finish Quiz</>
                    : <><span aria-hidden="true">→</span> Next Question</>
                  }
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && !error && phase === PHASE.RESULTS && (
          <Results
            questions={questions}
            answers={answers}
            onRetry={handleRetry}
          />
        )}
      </main>
    </div>
  );
}
