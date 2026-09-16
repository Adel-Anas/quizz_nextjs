"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { questions, CATEGORIES, CATEGORY_LABELS } from "@/lib/questions";
import { calculateScore, getScoreLabel } from "@/lib/scoring";

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

function useCountUp(target, durationMs = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!Number.isFinite(target)) return;
    let start = null;
    let frame;

    function tick(timestamp) {
      if (start === null) start = timestamp;
      const progress = Math.min(1, (timestamp - start) / durationMs);
      setValue(Math.round(progress * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center">
          <p className="text-slate-400">Chargement…</p>
        </main>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rawResult, setRawResult] = useState(null);
  const [status, setStatus] = useState("loading");

  const name =
    searchParams.get("name") ||
    (typeof window !== "undefined" ? sessionStorage.getItem("quizName") : null);

  useEffect(() => {
    if (!name) {
      router.replace("/");
      return;
    }

    async function loadResult() {
      try {
        const res = await fetch(`/api/results?name=${encodeURIComponent(name)}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.success && data.result) {
            setRawResult(data.result);
            setStatus("ready");
            return;
          }
        }
      } catch {
        // API pas encore disponible — on retombe sur le résultat local.
      }

      const stored = typeof window !== "undefined" ? sessionStorage.getItem("quizResult") : null;
      if (stored) {
        setRawResult(JSON.parse(stored));
        setStatus("ready");
      } else {
        setStatus("empty");
      }
    }

    loadResult();
  }, [name, router]);

  const computed = useMemo(() => {
    if (!rawResult?.answers) return null;
    return calculateScore(
      rawResult.answers.map((a) => ({ questionId: a.questionId, answer: a.answer })),
      questions
    );
  }, [rawResult]);

  const percentage = computed?.percentage ?? 0;
  const animatedScore = useCountUp(computed?.totalScore ?? 0);
  const animatedPercentage = useCountUp(percentage);
  const label = getScoreLabel(percentage);

  function handleExit() {
    if (typeof document !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    router.push("/");
  }

  if (status === "loading") {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-slate-400">Calcul des résultats…</p>
      </main>
    );
  }

  if (status === "empty" || !computed) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-slate-400">Aucun résultat trouvé pour {name}.</p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-full bg-accent px-6 py-2 font-bold text-slate-900"
        >
          Retour à l&apos;accueil
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-12 sm:px-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm uppercase tracking-widest text-slate-400">Résultat de {name}</p>
        <div className="text-7xl font-black text-white tabular-nums">
          {animatedScore}
          <span className="text-3xl text-slate-500"> / {computed.maxScore}</span>
        </div>
        <div className={`rounded-full px-4 py-1.5 text-sm font-bold ${LABEL_COLOR[label]}`}>
          {label} — {animatedPercentage}%
        </div>
      </div>

      <section className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-card/40 p-6">
        <h2 className="text-lg font-semibold text-white">Détail par catégorie</h2>
        {CATEGORIES.map((category) => {
          const entry = computed.breakdown[category];
          const pct = entry?.percentage ?? 0;
          return (
            <div key={category} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm text-slate-300">
                <span>{CATEGORY_LABELS[category] || category}</span>
                <span className="tabular-nums text-slate-400">
                  {entry ? `${entry.score}/${entry.max}` : "—"}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-1000 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
          <span>✨</span> Synthèse IA
        </h2>
        <p className="text-sm leading-relaxed text-slate-300">
          {rawResult?.aiAnalysis || "Analyse IA non disponible pour le moment."}
        </p>
        {typeof rawResult?.aiScore === "number" && (
          <p className="mt-3 text-sm font-semibold text-accent">Note IA : {rawResult.aiScore}/100</p>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-400">
        <span>Temps total : {formatDuration(rawResult?.timeSpent)}</span>
        <button
          type="button"
          onClick={handleExit}
          className="rounded-full border border-slate-600 px-6 py-2 font-semibold text-slate-200 hover:border-accent hover:text-accent"
        >
          Quitter
        </button>
      </div>
    </main>
  );
}
