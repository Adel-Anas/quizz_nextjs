import { CATEGORY_LABELS } from "./questions";

function optionText(question, optionId) {
  const option = question.options?.find((o) => o.id === optionId);
  return option ? option.text : optionId ?? "(pas de réponse)";
}

function formatAnswerLine(question, userAnswer, constraintDetails) {
  if (question.type === "dragdrop") {
    const items = new Map(question.items.map((item) => [item.id, item.label]));
    const given = Array.isArray(userAnswer) ? userAnswer : [];

    if (question.id === "dragdrop-1" && Array.isArray(constraintDetails)) {
      const failedIds = new Set(constraintDetails.filter((c) => !c.passed).map((c) => c.itemId));
      const passedCount = constraintDetails.length - failedIds.size;
      const givenLabels = given.map((id, i) => {
        const mark = failedIds.has(id) ? "✗" : "✓";
        return `  ${i + 1}. ${mark} ${items.get(id) || id}`;
      });
      return [
        `Contraintes respectées : ${passedCount} / ${constraintDetails.length}`,
        "Ordre soumis par le candidat :",
        ...givenLabels,
        ...(failedIds.size > 0
          ? [`Mal placés : ${[...failedIds].map((id) => items.get(id) || id).join(", ")}`]
          : []),
      ].join("\n");
    }

    const correct = question.correctOrder || [];
    const givenLabels = given.map((id, i) => {
      const mark = correct[i] === id ? "✓" : "✗";
      return `  ${i + 1}. ${mark} ${items.get(id) || id}`;
    });
    const correctLabels = correct.map((id, i) => `  ${i + 1}. ${items.get(id) || id}`);
    return [
      "Ordre soumis par le candidat :",
      ...givenLabels,
      "Ordre correct :",
      ...correctLabels,
    ].join("\n");
  }

  return [
    `Réponse du candidat : ${optionText(question, userAnswer)}`,
    `Réponse correcte : ${optionText(question, question.correctAnswer)}`,
  ].join("\n");
}

export function buildReportText(result, questions) {
  const questionsById = new Map(questions.map((q) => [q.id, q]));
  const lines = [];

  lines.push(`Rapport de quiz — ${result.name}`);
  lines.push(`Date : ${new Date(result.completedAt).toLocaleString("fr-FR")}`);
  lines.push(`Score : ${result.totalScore} / ${result.maxScore} (${result.percentage}%)`);
  lines.push(`Temps passé : ${Math.round((result.timeSpent || 0) / 60)} min`);
  lines.push("");
  lines.push("=".repeat(60));
  lines.push("");

  result.answers.forEach((answer, index) => {
    const question = questionsById.get(answer.questionId);
    if (!question) return;

    lines.push(`Question ${index + 1}/${result.answers.length} — ${answer.isCorrect ? "CORRECT" : "INCORRECT"} (${answer.points}/${question.points} pts)`);
    lines.push(`Catégorie : ${CATEGORY_LABELS[question.category] || question.category} | Difficulté : ${question.difficulty}`);
    lines.push(`Q: ${question.question}`);
    lines.push(formatAnswerLine(question, answer.answer, answer.constraintDetails));
    if (question.explanation) {
      lines.push(`Explication : ${question.explanation}`);
    }
    lines.push("");
  });

  return lines.join("\n");
}

export default buildReportText;
