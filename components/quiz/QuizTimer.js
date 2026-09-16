const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getColor(ratio) {
  if (ratio > 0.5) return "#22c55e";
  if (ratio > 0.2) return "#f59e0b";
  return "#ef4444";
}

export default function QuizTimer({ timeLeft, totalTime }) {
  const safeTotal = totalTime || 1;
  const ratio = Math.max(0, Math.min(1, timeLeft / safeTotal));
  const color = getColor(ratio);
  const offset = CIRCUMFERENCE * (1 - ratio);
  const critical = timeLeft <= 10;

  return (
    <div className={`relative h-24 w-24 shrink-0 ${critical ? "animate-pulse" : ""}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="#334155"
          strokeWidth="7"
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s linear" }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center text-xl font-bold tabular-nums"
        style={{ color }}
      >
        {Math.max(0, Math.ceil(timeLeft))}
      </div>
    </div>
  );
}
