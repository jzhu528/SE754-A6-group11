export default function ProgressBar({ current, total }) {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="progress-section" role="region" aria-label="Quiz progress">
      <div className="progress-label">
        <span>Question {current} of {total}</span>
        <span>{percent}% complete</span>
      </div>
      <div
        className="progress-bar-track"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Question ${current} of ${total}`}
      >
        <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
