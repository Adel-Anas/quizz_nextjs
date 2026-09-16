import Link from "next/link";
import { getScoreLabel } from "@/lib/scoring";

const LABEL_COLOR = {
  Expert: "text-accent bg-accent/15",
  Avancé: "text-sky-400 bg-sky-400/15",
  Intermédiaire: "text-amber-400 bg-amber-400/15",
  Débutant: "text-danger bg-danger/15",
};

function formatDuration(seconds) {
  const s = Math.max(0, Math.round(seconds || 0));
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return `${m}:${String(rest).padStart(2, "0")}`;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ResultCard({ result, onDelete }) {
  const percentage = result.percentage ?? 0;
  const label = getScoreLabel(percentage);
  const correctCount = (result.answers || []).filter((a) => a.isCorrect).length;
  const totalCount = (result.answers || []).length;

  function handleDeleteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Supprimer le résultat de ${result.name} ?`)) {
      onDelete?.(result._id);
    }
  }

  return (
    <Link
      href={`/dashboard-x7k2m9p4q/${result._id}`}
      className="relative flex flex-col gap-4 rounded-2xl border border-slate-800 bg-card/60 p-5 transition-colors hover:border-accent/60 hover:bg-slate-800/60"
    >
      <button
        type="button"
        onClick={handleDeleteClick}
        aria-label={`Supprimer le résultat de ${result.name}`}
        className="absolute right-4 top-4 rounded-full p-1.5 text-slate-500 hover:bg-danger/15 hover:text-danger"
      >
        🗑
      </button>

      <div className="flex items-start justify-between gap-2 pr-8">
        <div>
          <p className="text-lg font-bold text-white">{result.name}</p>
          <p className="text-xs text-slate-500">{formatDate(result.completedAt)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${LABEL_COLOR[label]}`}>
          {label}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div className="text-3xl font-black text-white tabular-nums">
          {result.totalScore}
          <span className="text-base font-normal text-slate-500"> / {result.maxScore}</span>
        </div>
        <div className="text-2xl font-bold tabular-nums text-accent">{percentage}%</div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-slate-400">
        <span>{correctCount}/{totalCount} correctes</span>
        <span>⏱ {formatDuration(result.timeSpent)}</span>
      </div>
    </Link>
  );
}
