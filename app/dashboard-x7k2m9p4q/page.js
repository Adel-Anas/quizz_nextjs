"use client";

import { useCallback, useEffect, useState } from "react";
import ResultCard from "@/components/dashboard/ResultCard";
import ScoreSummary from "@/components/dashboard/ScoreSummary";

export default function DashboardPage() {
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const loadResults = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/results", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Erreur inconnue");
        setStatus("error");
        return;
      }

      setResults(data.results || []);
      setStatus("ready");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  const handleDelete = useCallback(async (id) => {
    const previous = results;
    setResults((current) => current.filter((r) => r._id !== id));

    try {
      const res = await fetch(`/api/results?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Suppression échouée");
      }
    } catch (err) {
      setResults(previous);
      alert("Erreur lors de la suppression : " + err.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-white">Dashboard formateur</h1>
        <button
          type="button"
          onClick={loadResults}
          disabled={status === "loading"}
          className="rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {status === "loading" ? "Chargement…" : "↻ Rafraîchir"}
        </button>
      </div>

      {status === "loading" && results.length === 0 && (
        <p className="text-slate-400">Chargement des résultats…</p>
      )}

      {status === "error" && (
        <div className="rounded-2xl border border-danger/40 bg-danger/10 p-5 text-sm text-danger">
          <p className="font-semibold">Erreur : {error}</p>
          <p className="mt-1 text-slate-400">
            Vérifie que MONGODB_URI est correct et que ton IP est autorisée dans MongoDB Atlas
            (Network Access).
          </p>
        </div>
      )}

      {status === "ready" && results.length === 0 && (
        <p className="text-slate-400">Aucun résultat pour le moment — fais passer le quiz à quelqu'un.</p>
      )}

      {results.length > 0 && (
        <>
          <ScoreSummary results={results} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((result) => (
              <ResultCard key={result._id} result={result} onDelete={handleDelete} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
