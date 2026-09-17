import { questions as allQuestions } from "./questions";

// Contraintes parent-enfant pour dragdrop-1 (arborescence Dir Khir).
// mustBeDepth : l'item doit être un dossier/fichier racine (depth 0).
// mustBeChildOf : l'item doit apparaître après son parent, avant le prochain
// item de profondeur <= celle du parent, et à depth = parent.depth + 1.
const TREE_CONSTRAINTS = [
  { id: "1", mustBeDepth: 0 }, // lib/
  { id: "4", mustBeDepth: 0 }, // models/
  { id: "7", mustBeDepth: 0 }, // app/
  { id: "19", mustBeDepth: 0 }, // proxy.js

  { id: "2", mustBeChildOf: "1" }, // db.js
  { id: "3", mustBeChildOf: "1" }, // auth.js

  { id: "5", mustBeChildOf: "4" }, // Besoin.js
  { id: "6", mustBeChildOf: "4" }, // Message.js

  { id: "8", mustBeChildOf: "7" }, // layout.js
  { id: "9", mustBeChildOf: "7" }, // page.js (accueil)
  { id: "10", mustBeChildOf: "7" }, // besoins/
  { id: "16", mustBeChildOf: "7" }, // api/

  { id: "11", mustBeChildOf: "10" }, // besoins/page.js
  { id: "12", mustBeChildOf: "10" }, // [id]/

  { id: "13", mustBeChildOf: "12" }, // [id]/page.js
  { id: "14", mustBeChildOf: "12" }, // modifier/

  { id: "15", mustBeChildOf: "14" }, // modifier/page.js

  { id: "17", mustBeChildOf: "16" }, // api/besoins/

  { id: "18", mustBeChildOf: "17" }, // route.js
];

const TREE_ORDER_THRESHOLD = 0.85;

function validateTreeOrder(question, userOrder) {
  const items = question.items || [];
  const orderedItems = userOrder.map((id) => items.find((item) => item.id === id)).filter(Boolean);

  const constraintDetails = TREE_CONSTRAINTS.map((constraint) => {
    const itemLabel = items.find((i) => i.id === constraint.id)?.label || constraint.id;
    const itemIndex = orderedItems.findIndex((item) => item.id === constraint.id);

    if (itemIndex === -1) {
      return { itemId: constraint.id, itemLabel, passed: false };
    }

    const item = orderedItems[itemIndex];

    if (constraint.mustBeDepth !== undefined) {
      return { itemId: constraint.id, itemLabel, passed: item.depth === constraint.mustBeDepth };
    }

    const parentIndex = orderedItems.findIndex((i) => i.id === constraint.mustBeChildOf);
    if (parentIndex === -1 || parentIndex >= itemIndex) {
      return { itemId: constraint.id, itemLabel, passed: false };
    }

    const parent = orderedItems[parentIndex];
    if (item.depth !== parent.depth + 1) {
      return { itemId: constraint.id, itemLabel, passed: false };
    }

    for (let i = parentIndex + 1; i < itemIndex; i++) {
      if (orderedItems[i].depth <= parent.depth) {
        return { itemId: constraint.id, itemLabel, passed: false };
      }
    }

    return { itemId: constraint.id, itemLabel, passed: true };
  });

  const totalPoints = constraintDetails.filter((c) => c.passed).length;
  const maxPoints = TREE_CONSTRAINTS.length;
  const ratio = maxPoints > 0 ? totalPoints / maxPoints : 0;

  return {
    isCorrect: ratio >= TREE_ORDER_THRESHOLD,
    ratio,
    points: Math.round(question.points * ratio),
    constraintDetails,
  };
}

function validateStrictOrder(question, userOrder) {
  const correct = question.correctOrder || [];
  const given = Array.isArray(userOrder) ? userOrder : [];
  let correctPositions = 0;
  given.forEach((itemId, index) => {
    if (correct[index] === itemId) correctPositions++;
  });
  const ratio = correct.length > 0 ? correctPositions / correct.length : 0;
  return {
    isCorrect: correctPositions === correct.length,
    ratio,
    points: Math.round(question.points * ratio),
  };
}

export function validateDragDropAnswer(question, userOrder) {
  const given = Array.isArray(userOrder) ? userOrder : [];

  // dragdrop-1 (arborescence) : seule la position sous le bon parent compte,
  // l'ordre entre dossiers/fichiers frères est libre.
  if (question.id === "dragdrop-1") {
    return validateTreeOrder(question, given);
  }

  // dragdrop-2 (cycle Server Action) et tout autre drag & drop : séquence
  // chronologique, l'ordre exact est requis.
  return validateStrictOrder(question, given);
}

function gradeAnswer(question, answer) {
  if (question.type === "dragdrop") {
    const correctOrder = question.correctOrder || [];
    if (!Array.isArray(answer) || answer.length !== correctOrder.length) {
      return { isCorrect: false, points: 0 };
    }
    return validateDragDropAnswer(question, answer);
  }

  // mcq, code, bugfix — tout ou rien
  const isCorrect = answer === question.correctAnswer;
  return { isCorrect, points: isCorrect ? question.points : 0 };
}

export function calculateScore(answers, questions = allQuestions) {
  const questionsById = new Map(questions.map((question) => [question.id, question]));

  const breakdown = {};
  let totalScore = 0;
  let maxScore = 0;

  const gradedAnswers = answers.map((entry) => {
    const question = questionsById.get(entry.questionId);

    if (!question) {
      return { ...entry, isCorrect: false, points: 0 };
    }

    const { isCorrect: correct, points, constraintDetails } = gradeAnswer(question, entry.answer);

    if (!breakdown[question.category]) {
      breakdown[question.category] = { score: 0, max: 0, percentage: 0 };
    }
    breakdown[question.category].score += points;
    breakdown[question.category].max += question.points;

    totalScore += points;
    maxScore += question.points;

    return {
      questionId: question.id,
      questionType: question.type,
      answer: entry.answer,
      isCorrect: correct,
      points,
      ...(constraintDetails ? { constraintDetails } : {}),
    };
  });

  for (const category of Object.keys(breakdown)) {
    const { score, max } = breakdown[category];
    breakdown[category].percentage = max > 0 ? Math.round((score / max) * 100) : 0;
  }

  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return { totalScore, maxScore, percentage, breakdown, answers: gradedAnswers };
}

export function getScoreLabel(percentage) {
  if (percentage >= 85) return "Expert";
  if (percentage >= 70) return "Avancé";
  if (percentage >= 55) return "Intermédiaire";
  return "Débutant";
}

export function getTimeLimitForQuestion(questionId, questions = allQuestions) {
  const question = questions.find((q) => q.id === questionId);
  return question ? question.timeLimit : null;
}
