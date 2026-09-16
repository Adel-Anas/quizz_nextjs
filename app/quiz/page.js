"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/questions";
import { calculateScore } from "@/lib/scoring";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuizTimer from "@/components/quiz/QuizTimer";
import QuestionMCQ from "@/components/quiz/QuestionMCQ";
import QuestionCode from "@/components/quiz/QuestionCode";
import QuestionBugFix from "@/components/quiz/QuestionBugFix";
import QuestionDragDrop from "@/components/quiz/QuestionDragDrop";

const QUESTION_COMPONENTS = {
  mcq: QuestionMCQ,
  code: QuestionCode,
  bugfix: QuestionBugFix,
  dragdrop: QuestionDragDrop,
};

export default function QuizPage() {
  const router = useRouter();
  const [name, setName] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState({});
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit ?? 30);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startTimeRef = useRef(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  useEffect(() => {
    const storedName = typeof window !== "undefined" ? sessionStorage.getItem("quizName") : null;
    if (!storedName) {
      router.replace("/");
      return;
    }
    setName(storedName);
    startTimeRef.current = Date.now();
  }, [router]);

  useEffect(() => {
    function requestFullscreen() {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      }
    }
    requestFullscreen();

    function handleChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const finishQuiz = useCallback(
    async (finalAnswersMap) => {
      setIsSubmitting(true);

      const answers = questions.map((q) => ({
        questionId: q.id,
        answer: finalAnswersMap[q.id] ?? null,
      }));

      const timeSpent = startTimeRef.current
        ? Math.round((Date.now() - startTimeRef.current) / 1000)
        : 0;

      // Garde un résultat calculé localement en secours si l'API est indisponible.
      if (typeof window !== "undefined") {
        const localResult = calculateScore(answers, questions);
        sessionStorage.setItem(
          "quizResult",
          JSON.stringify({ name, answers, timeSpent, ...localResult })
        );
      }

      try {
        const response = await fetch("/api/submit-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, answers, timeSpent }),
        });

        const data = await response.json();

        if (!data.success) {
          console.error("Erreur submission:", data.error);
        } else {
          console.log("Quiz soumis ! Score:", data.percentage + "%");
        }
      } catch (error) {
        console.error("Erreur réseau:", error);
      }

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      router.push(`/results?name=${encodeURIComponent(name)}`);
    },
    [name, router]
  );

  const goToNext = useCallback(
    (map) => {
      if (isLastQuestion) {
        finishQuiz(map);
        return;
      }
      setCurrentIndex((i) => i + 1);
    },
    [isLastQuestion, finishQuiz]
  );

  // Countdown timer for the current question.
  useEffect(() => {
    if (!name) return;
    setTimeLeft(currentQuestion.timeLimit);

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, currentQuestion, name]);

  // Auto-advance when time runs out.
  useEffect(() => {
    if (timeLeft !== 0 || !name) return;
    goToNext(answersMap);
  }, [timeLeft, name, goToNext, answersMap]);

  const handleAnswer = useCallback(
    (answer) => {
      setAnswersMap((prev) => ({ ...prev, [currentQuestion.id]: answer }));
    },
    [currentQuestion]
  );

  const hasAnswer = answersMap[currentQuestion?.id] !== undefined;
  const QuestionComponent = useMemo(
    () => QUESTION_COMPONENTS[currentQuestion?.type],
    [currentQuestion]
  );

  if (!name || !currentQuestion) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-slate-400">Chargement du quiz…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-6 sm:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8">
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <QuizProgress current={currentIndex} total={questions.length} />
          </div>
          <QuizTimer timeLeft={timeLeft} totalTime={currentQuestion.timeLimit} />
        </div>

        {!isFullscreen && (
          <button
            type="button"
            onClick={() => document.documentElement.requestFullscreen?.().catch(() => {})}
            className="w-fit rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-400 hover:border-accent hover:text-accent"
          >
            Activer le plein écran
          </button>
        )}

        <div
          key={currentQuestion.id}
          className="animate-fade-in flex flex-1 flex-col justify-center rounded-2xl border border-slate-800 bg-card/40 p-6 sm:p-10"
        >
          <QuestionComponent
            question={currentQuestion}
            onAnswer={handleAnswer}
            selectedAnswer={answersMap[currentQuestion.id]}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            disabled={!hasAnswer || isSubmitting}
            onClick={() => goToNext(answersMap)}
            className="rounded-full bg-accent px-8 py-3 font-bold text-slate-900 transition-opacity disabled:cursor-not-allowed disabled:opacity-30 hover:opacity-90"
          >
            {isSubmitting
              ? "Envoi…"
              : isLastQuestion
                ? "Terminer le quiz →"
                : "Question suivante →"}
          </button>
        </div>
      </div>
    </main>
  );
}
