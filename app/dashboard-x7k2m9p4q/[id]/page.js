"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { questions } from "@/lib/questions";
import { getScoreLabel } from "@/lib/scoring";
import { buildReportText } from "@/lib/report";
import AnswerDetail from "@/components/dashboard/AnswerDetail";

const LABEL_COLOR = {
  Expert: "text-accent bg-accent/15",
  Avancé: "text-sky-400 bg-sky-400/15",
  Intermédiaire: "text-amber-400 bg-amber-400/15",
  Débutant: "text-danger bg-danger/15",
};

export default function ResultDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/results?id=${encodeURIComponent(id)}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.error || "Erreur inconnue");
          setStatus("error");
          return;
        }
        setResult(data.result);
        setStatus("ready");
      } catch (err) {
        setError(err.message);
        setStatus("error");
      }
    }
    if (id) load();
  }, [id]);

  function handleDownload() {
    const text = buildReportText(result, questions);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-${result.name.replace(/\s+/g, "_")}-${result._id}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  if (status === "loading") {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-slate-400">Chargement…</p>
      </main>
    );
  }

  if (status === "error" || !result) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-danger">{error || "Résultat introuvable"}</p>
        <button
          type="button"
          onClick={() => router.push("/dashboard-x7k2m9p4q")}
          className="rounded-full bg-accent px-6 py-2 font-bold text-slate-900"
        >
          Retour au dashboard
        </button>
      </main>
    );
  }

  const label = getScoreLabel(result.percentage);
  const questionsById = new Map(questions.map((q) => [q.id, q]));

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-8">
      <button
        type="button"
        onClick={() => router.push("/dashboard-x7k2m9p4q")}
        className="w-fit text-sm text-slate-400 hover:text-accent"
      >
        ← Retour au dashboard
      </button>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-card/60 p-6">
        <div>
          <h1 className="text-2xl font-black text-white">{result.name}</h1>
          <p className="text-sm text-slate-500">
            {new Date(result.completedAt).toLocaleString("fr-FR")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-3xl font-black text-white tabular-nums">
              {result.totalScore}
              <span className="text-base font-normal text-slate-500"> / {result.maxScore}</span>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${LABEL_COLOR[label]}`}>
              {label} — {result.percentage}%
            </span>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-slate-900 hover:opacity-90"
          >
            ⬇ Télécharger
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {result.answers.map((answer, index) => (
          <AnswerDetail
            key={answer.questionId || index}
            index={index}
            question={questionsById.get(answer.questionId)}
            answer={answer}
          />
        ))}
      </div>
    </main>
  );
}
