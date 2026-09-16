import { highlightCode } from "./highlightCode";
import { CATEGORY_LABELS } from "@/lib/questions";

export default function QuestionBugFix({ question, onAnswer, selectedAnswer }) {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-danger/15 px-3 py-1 text-xs font-semibold text-danger">
          🐛 Bug à corriger
        </span>
        <span className="rounded-full bg-primary/40 px-3 py-1 text-xs font-medium text-slate-200">
          {CATEGORY_LABELS[question.category] || question.category}
        </span>
      </div>

      <h2 className="text-2xl font-semibold leading-snug text-white sm:text-3xl">
        {question.question}
      </h2>

      {question.bugDescription && (
        <p className="italic text-slate-400">{question.bugDescription}</p>
      )}

      <pre className="overflow-x-auto rounded-lg border-2 border-danger/40 bg-slate-950 p-4 text-sm leading-relaxed">
        <code
          className="font-mono"
          dangerouslySetInnerHTML={{ __html: highlightCode(question.codeWithBug) }}
        />
      </pre>

      <div className="grid gap-4 sm:grid-cols-2">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onAnswer(option.id)}
              className={`group flex items-start gap-3 rounded-xl border-2 bg-card p-4 text-left transition-all hover:border-accent/60 hover:bg-slate-800 ${
                isSelected ? "border-accent bg-slate-800" : "border-slate-700"
              }`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                  isSelected ? "border-accent bg-accent text-slate-900" : "border-slate-500 text-slate-400"
                }`}
              >
                {isSelected ? "✓" : option.id.toUpperCase()}
              </span>
              <span className="text-sm leading-relaxed text-slate-100 sm:text-base">{option.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
