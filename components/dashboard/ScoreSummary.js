import { getScoreLabel } from "@/lib/scoring";

export default function ScoreSummary({ results }) {
  const count = results.length;
  const avgPercentage = count
    ? Math.round(results.reduce((sum, r) => sum + (r.percentage ?? 0), 0) / count)
    : 0;
  const best = count ? Math.max(...results.map((r) => r.percentage ?? 0)) : 0;

  const distribution = results.reduce((acc, r) => {
    const label = getScoreLabel(r.percentage ?? 0);
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: "Participants", value: count },
    { label: "Score moyen", value: `${avgPercentage}%` },
    { label: "Meilleur score", value: `${best}%` },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-slate-800 bg-card/60 p-5 text-center">
          <div className="text-3xl font-black text-white tabular-nums">{stat.value}</div>
          <div className="text-xs text-slate-500">{stat.label}</div>
        </div>
      ))}
      <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-card/60 p-5 sm:col-span-3">
        {["Expert", "Avancé", "Intermédiaire", "Débutant"].map((label) => (
          <span key={label} className="text-xs text-slate-400">
            <span className="font-bold text-white">{distribution[label] || 0}</span> {label}
          </span>
        ))}
      </div>
    </div>
  );
}
