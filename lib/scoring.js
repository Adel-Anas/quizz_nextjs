import { questions as allQuestions } from "./questions";

function gradeAnswer(question, answer) {
  if (question.type === "dragdrop") {
    const correctOrder = question.correctOrder || [];
    if (!Array.isArray(answer) || answer.length !== correctOrder.length) {
      return { isCorrect: false, points: 0 };
    }
    const correctCount = answer.filter((value, index) => value === correctOrder[index]).length;
    const isCorrect = correctCount === correctOrder.length;
    const points = isCorrect
      ? question.points
      : Math.round((correctCount / correctOrder.length) * question.points);
    return { isCorrect, points };
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

    const { isCorrect: correct, points } = gradeAnswer(question, entry.answer);

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
