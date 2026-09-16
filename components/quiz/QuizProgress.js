export default function QuizProgress({ current, total }) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-300">
        <span>
          Question <span className="text-white">{Math.min(current + 1, total)}</span> / {total}
        </span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
