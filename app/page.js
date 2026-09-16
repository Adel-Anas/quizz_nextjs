"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, CATEGORY_LABELS, questions } from "@/lib/questions";

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Entre au moins 2 caractères.");
      return;
    }
    sessionStorage.setItem("quizName", trimmed);
    router.push("/quiz");
  }

  return (
    <main className="flex flex-1 flex-col">
      <header className="flex items-center justify-center gap-2 border-b border-slate-800 py-6">
        <span className="text-2xl">⚡</span>
        <span className="text-lg font-bold text-white">Quiz Next.js</span>
        <span className="hidden text-slate-500 sm:inline">
          — Évaluation Formation Next.js Full-Stack
        </span>
      </header>

      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-10 px-4 py-16 text-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-black text-white sm:text-5xl">
            Prêt à valider tes compétences ?
          </h1>
          <p className="text-lg text-slate-400">
            {questions.length} questions • {CATEGORIES.length} catégories • Analyse IA de tes résultats
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((category, index) => (
            <span
              key={category}
              className="animate-fade-in rounded-full border border-primary bg-primary/30 px-4 py-2 text-sm font-medium text-slate-200"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: "backwards" }}
            >
              {CATEGORY_LABELS[category] || category}
            </span>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3">
          <label htmlFor="firstName" className="text-sm font-medium text-slate-400">
            Ton prénom
          </label>
          <input
            id="firstName"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            placeholder="Ex: Youssef"
            aria-label="Ton prénom"
            className="rounded-xl border-2 border-slate-700 bg-card px-4 py-3 text-center text-lg text-white outline-none focus:border-accent"
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <button
            type="submit"
            className="rounded-full bg-accent px-8 py-4 text-lg font-bold text-slate-900 transition-opacity hover:opacity-90"
          >
            Lancer le Quiz →
          </button>
        </form>

        <div className="flex gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{questions.length}</div>
            <div className="text-xs text-slate-500">questions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">~57 min</div>
            <div className="text-xs text-slate-500">durée</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">✨ IA</div>
            <div className="text-xs text-slate-500">analyse</div>
          </div>
        </div>
      </section>
    </main>
  );
}
