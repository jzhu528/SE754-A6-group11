import { useState, useEffect, useRef } from 'react';
import Question from './components/Question';
import Results from './components/Results';

const PHASE = { START: 'start', LENGTH: 'length', QUIZ: 'quiz', RESULTS: 'results' };
const FONT_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
const QUIZ_LENGTH_OPTIONS = [
  { id: 'quick', label: 'Quick', count: 5 },
  { id: 'standard', label: 'Standard', count: 10 },
  { id: 'full', label: 'Full', count: 15 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function prepareQuestions(raw) {
  return shuffle(raw).map(q => {
    const tagged = q.options.map((opt, i) => ({ opt, correct: i === q.correctIndex }));
    const shuffled = shuffle(tagged);
    return {
      ...q,
      options: shuffled.map(x => x.opt),
      correctIndex: shuffled.findIndex(x => x.correct),
    };
  });
}

export default function App() {
  const [phase, setPhase] = useState(PHASE.START);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const rawQuestions = useRef([]);
  const [fontSize, setFontSize] = useState('md');
  const [selectedQuizLength, setSelectedQuizLength] = useState(5);

  async function loadQuestions() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/questions');
      if (!res.ok) throw new Error('Failed to load questions');
      const data = await res.json();
      rawQuestions.current = data;
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

  useEffect(() => {
    // Apply font size class to the root element
    const root = document.documentElement;
    root.classList.remove('font-xs', 'font-sm', 'font-md', 'font-lg', 'font-xl', 'font-xxl');
    root.classList.add(`font-${fontSize}`);
  }, [fontSize]);

  function showLengthSelection() {
    setPhase(PHASE.LENGTH);
  }

  function startQuiz() {
    const preparedQuestions = prepareQuestions(rawQuestions.current).slice(0, selectedQuizLength);
    setQuestions(preparedQuestions);
    setCurrentIndex(0);
    setAnswers(Array(preparedQuestions.length).fill(null));
    setQuizResult(null);
    setSubmissionError(null);
    setPhase(PHASE.QUIZ);
  }

  function handleAnswer(optionIndex) {
    setSubmissionError(null);
    setAnswers((currentAnswers) => {
      const nextAnswers = [...currentAnswers];
      nextAnswers[currentIndex] = optionIndex;
      return nextAnswers;
    });
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      submitQuiz();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handleRetry() {
    setCurrentIndex(0);
    setAnswers([]);
    setQuizResult(null);
    setSubmissionError(null);
    setPhase(PHASE.START);
  }

  async function submitQuiz() {
    setSubmitting(true);
    setSubmissionError(null);

    try {
      const responses = questions.map((question, index) => ({
        questionId: question.id,
        selectedOption: answers[index] === null || answers[index] === undefined
          ? null
          : question.options[answers[index]]
      }));

      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses })
      });

      if (!res.ok) throw new Error('Failed to submit quiz');

      const result = await res.json();
      setQuizResult(result);
      setPhase(PHASE.RESULTS);
    } catch (e) {
      setSubmissionError('Could not submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function handlePrevious() {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }

  function handleQuestionJump(index) {
    setCurrentIndex(index);
  }

  function changeFontSize(direction) {
    setFontSize((current) => {
      const currentIndex = FONT_SIZES.indexOf(current);
      const nextIndex = Math.min(
        Math.max(currentIndex + direction, 0),
        FONT_SIZES.length - 1
      );
      return FONT_SIZES[nextIndex];
    });
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex + 1 >= questions.length;
  const isFirstQuestion = currentIndex === 0;
  const answered = answers[currentIndex] ?? null;
  const selectedQuizLengthOption = QUIZ_LENGTH_OPTIONS.find(
    (option) => option.count === selectedQuizLength
  );
  const canDecreaseFont = fontSize !== FONT_SIZES[0];
  const canIncreaseFont = fontSize !== FONT_SIZES[FONT_SIZES.length - 1];

  return (
    <div className="app-wrapper">
      <nav className="font-toolbar" aria-label="Font size controls">
        <header className="app-header">
          <h1>Java OOP Quiz</h1>
          <p>Learn Object-Oriented Programming step by step</p>
        </header>
        <div className="toolbar-buttons">
          <button
            className="toolbar-btn"
            onClick={() => changeFontSize(1)}
            disabled={!canIncreaseFont}
            aria-label="Increase text size"
            title="Increase text size"
          >
            A+
          </button>
          <button
            className="toolbar-btn"
            onClick={() => changeFontSize(-1)}
            disabled={!canDecreaseFont}
            aria-label="Decrease text size"
            title="Decrease text size"
          >
            A-
          </button>
        </div>
      </nav>

      <div className={`content-layout ${phase === PHASE.QUIZ ? 'quiz-layout' : ''}`}>
        {!loading && !error && phase === PHASE.QUIZ && (
          <aside className="quiz-map" aria-label="Quiz question navigation">
            <h2>Questions</h2>
            <ol className="quiz-map-list">
              {questions.map((q, i) => {
                const answer = answers[i];
                const isAnswered = answer !== null && answer !== undefined;
                const isCorrect = isAnswered && answer === q.correctIndex;
                const status = !isAnswered ? 'unanswered' : isCorrect ? 'correct' : 'wrong';

                return (
                  <li key={q.id}>
                    <button
                      className={`quiz-map-item ${status} ${i === currentIndex ? 'active' : ''}`}
                      onClick={() => handleQuestionJump(i)}
                      aria-current={i === currentIndex ? 'step' : undefined}
                      aria-label={`Go to Question ${i + 1}`}
                    >
                      <span className="quiz-map-status" aria-hidden="true">
                        {status === 'correct' ? '✓' : status === 'wrong' ? '×' : '?'}
                      </span>
                      <span className="quiz-map-text">Question {i + 1}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <button
              className="btn btn-secondary quiz-map-retake"
              onClick={handleRetry}
              aria-label="Retake the quiz from the beginning"
            >
              <span aria-hidden="true">🔄</span> Retake Quiz
            </button>
          </aside>
        )}

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
              onClick={showLengthSelection}
              aria-label="Start the Java OOP quiz"
            >
              <span aria-hidden="true">▶</span> Start Quiz
            </button>
          </div>
        )}

        {!loading && !error && phase === PHASE.LENGTH && (
          <div className="start-screen">
            <span className="icon" aria-hidden="true">📝</span>
            <h2>Choose your quiz length</h2>
            <p>Select a shorter or longer quiz before you begin.</p>
            <div className="quiz-length-section" role="radiogroup" aria-label="Choose quiz length">
              {QUIZ_LENGTH_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`quiz-length-option ${selectedQuizLength === option.count ? 'active' : ''}`}
                  onClick={() => setSelectedQuizLength(option.count)}
                  role="radio"
                  aria-checked={selectedQuizLength === option.count}
                >
                  <span className="quiz-length-label">{option.label}</span>
                </button>
              ))}
            </div>
            <p className="quiz-length-description">
              {selectedQuizLengthOption?.count ?? selectedQuizLength} multiple-choice questions
            </p>
            <button
              className="btn btn-primary"
              onClick={startQuiz}
              aria-label="Continue to quiz questions"
            >
              Continue
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
            <div className="btn-actions">
              <button
                className="btn btn-secondary"
                onClick={handlePrevious}
                disabled={isFirstQuestion || submitting}
                aria-label="Go to previous question"
              >
                <span aria-hidden="true">←</span> Previous Question
              </button>
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={submitting}
                aria-label={isLastQuestion ? 'Finish quiz and see results' : 'Go to next question'}
              >
                {submitting
                  ? 'Submitting...'
                  : isLastQuestion
                  ? <><span aria-hidden="true">🏁</span> Finish Quiz</>
                  : <><span aria-hidden="true">→</span> Next Question</>
                }
              </button>
            </div>
            {submissionError && (
              <div className="error-box submission-error" role="alert">
                {submissionError}
              </div>
            )}
          </div>
        )}

        {!loading && !error && phase === PHASE.RESULTS && (
          <Results
            questions={questions}
            answers={answers}
            result={quizResult}
            onRetry={handleRetry}
          />
        )}
      </main>
      </div>
    </div>
  );
}
