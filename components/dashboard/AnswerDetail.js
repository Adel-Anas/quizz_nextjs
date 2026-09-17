import { highlightCode } from "@/components/quiz/highlightCode";

const DIFFICULTY_LABEL = { easy: "Facile", medium: "Moyen", hard: "Difficile" };

function CodeBlock({ code }) {
  return (
    <pre className="mt-2 overflow-x-auto rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs leading-relaxed">
      <code className="font-mono" dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
    </pre>
  );
}

function ChoiceOptions({ question, userAnswer }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {question.options.map((option) => {
        const isCorrectOption = option.id === question.correctAnswer;
        const isUserChoice = option.id === userAnswer;
        const state = isCorrectOption ? "correct" : isUserChoice ? "wrong" : "neutral";

        return (
          <div
            key={option.id}
            className={`rounded-lg border-2 p-3 text-sm ${
              state === "correct"
                ? "border-accent bg-accent/10"
                : state === "wrong"
                  ? "border-danger bg-danger/10"
                  : "border-slate-700 bg-slate-900/40"
            }`}
          >
            <div className="flex items-center gap-2 text-slate-200">
              <span className="font-bold">{option.id.toUpperCase()}.</span>
              <span>{option.text}</span>
              {isCorrectOption && <span className="text-accent">✓ correcte</span>}
              {isUserChoice && !isCorrectOption && <span className="text-danger">✗ choix du candidat</span>}
              {isUserChoice && isCorrectOption && <span className="text-accent">(choix du candidat)</span>}
            </div>
            {option.code && <CodeBlock code={option.code} />}
          </div>
        );
      })}
    </div>
  );
}

function DragDropTreeAnswer({ question, userAnswer, constraintDetails }) {
  const items = new Map(question.items.map((item) => [item.id, item.label]));
  const given = Array.isArray(userAnswer) ? userAnswer : [];
  const failedIds = new Set((constraintDetails || []).filter((c) => !c.passed).map((c) => c.itemId));
  const passedCount = (constraintDetails || []).filter((c) => c.passed).length;
  const totalCount = constraintDetails?.length ?? 0;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-slate-300">
        {passedCount} / {totalCount} contraintes respectées
      </p>
      <ol className="flex flex-col gap-1.5">
        {given.map((id, i) => {
          const ok = !failedIds.has(id);
          return (
            <li
              key={`${id}-${i}`}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                ok ? "border-accent/50 bg-accent/10 text-slate-100" : "border-danger/50 bg-danger/10 text-slate-100"
              }`}
            >
              {ok ? "✓" : "✗"} {items.get(id) || id}
            </li>
          );
        })}
      </ol>
      {failedIds.size > 0 && (
        <p className="rounded-lg bg-danger/10 p-3 text-sm text-danger">
          Mal placés : {[...failedIds].map((id) => items.get(id) || id).join(", ")}
        </p>
      )}
    </div>
  );
}

function DragDropOrderAnswer({ question, userAnswer }) {
  const items = new Map(question.items.map((item) => [item.id, item.label]));
  const given = Array.isArray(userAnswer) ? userAnswer : [];
  const correct = question.correctOrder || [];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Ordre soumis</p>
        <ol className="flex flex-col gap-1.5">
          {given.map((id, i) => {
            const ok = correct[i] === id;
            return (
              <li
                key={`${id}-${i}`}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  ok ? "border-accent/50 bg-accent/10 text-slate-100" : "border-danger/50 bg-danger/10 text-slate-100"
                }`}
              >
                {ok ? "✓" : "✗"} {items.get(id) || id}
              </li>
            );
          })}
        </ol>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Ordre correct</p>
        <ol className="flex flex-col gap-1.5">
          {correct.map((id, i) => (
            <li key={`${id}-${i}`} className="rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-1.5 text-sm text-slate-300">
              {i + 1}. {items.get(id) || id}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function DragDropAnswer({ question, userAnswer, constraintDetails }) {
  if (question.id === "dragdrop-1") {
    return (
      <DragDropTreeAnswer question={question} userAnswer={userAnswer} constraintDetails={constraintDetails} />
    );
  }
  return <DragDropOrderAnswer question={question} userAnswer={userAnswer} />;
}

export default function AnswerDetail({ index, question, answer }) {
  if (!question) return null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-card/40 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-500">
          Question {index + 1} — {DIFFICULTY_LABEL[question.difficulty] || question.difficulty}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            answer.isCorrect ? "bg-accent/15 text-accent" : "bg-danger/15 text-danger"
          }`}
        >
          {answer.isCorrect ? "✓ Correct" : "✗ Incorrect"} · {answer.points}/{question.points} pts
        </span>
      </div>

      <h3 className="text-lg font-semibold text-white">{question.question}</h3>

      {question.codeSnippet && <CodeBlock code={question.codeSnippet} />}
      {question.codeWithBug && <CodeBlock code={question.codeWithBug} />}

      {question.type === "dragdrop" ? (
        <DragDropAnswer question={question} userAnswer={answer.answer} constraintDetails={answer.constraintDetails} />
      ) : (
        <ChoiceOptions question={question} userAnswer={answer.answer} />
      )}

      {question.explanation && (
        <p className="rounded-lg bg-slate-900/60 p-3 text-sm leading-relaxed text-slate-400">
          <span className="font-semibold text-slate-300">Explication : </span>
          {question.explanation}
        </p>
      )}
    </div>
  );
}
