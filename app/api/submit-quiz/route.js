import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import QuizResult from "@/models/QuizResult";
import { questions } from "@/lib/questions";

function calculateScore(userAnswers) {
  let totalScore = 0;
  const maxScore = questions.reduce((sum, q) => sum + q.points, 0);

  const processedAnswers = userAnswers.map((userAnswer) => {
    const question = questions.find((q) => q.id === userAnswer.questionId);
    if (!question) return { ...userAnswer, isCorrect: false, points: 0 };

    let isCorrect = false;

    if (question.type === "dragdrop") {
      // Score partiel pour le drag & drop : 1 point par item bien placé
      const correct = question.correctOrder;
      const given = userAnswer.answer || [];
      let correctPositions = 0;
      given.forEach((itemId, index) => {
        if (correct[index] === itemId) correctPositions++;
      });
      const ratio = correct.length > 0 ? correctPositions / correct.length : 0;
      const points = Math.round(question.points * ratio);
      totalScore += points;
      return {
        questionId: userAnswer.questionId,
        questionType: question.type,
        answer: userAnswer.answer,
        isCorrect: ratio === 1,
        points,
      };
    } else {
      isCorrect = userAnswer.answer === question.correctAnswer;
      const points = isCorrect ? question.points : 0;
      totalScore += points;
      return {
        questionId: userAnswer.questionId,
        questionType: question.type,
        answer: userAnswer.answer,
        isCorrect,
        points,
      };
    }
  });

  const percentage = Math.round((totalScore / maxScore) * 100);

  return { processedAnswers, totalScore, maxScore, percentage };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, answers, timeSpent } = body;

    // Validation basique
    if (!name || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Données manquantes : name et answers requis" },
        { status: 400 }
      );
    }

    // Connexion MongoDB
    await connectDB();

    // Calcul du score
    const { processedAnswers, totalScore, maxScore, percentage } =
      calculateScore(answers);

    // Sauvegarde dans MongoDB
    const result = await QuizResult.create({
      name: name.trim(),
      answers: processedAnswers,
      totalScore,
      maxScore,
      percentage,
      timeSpent: timeSpent || 0,
      aiAnalysis: "",
      completedAt: new Date(),
    });

    console.log("✅ Résultat sauvegardé dans MongoDB :", result._id);

    return NextResponse.json({
      success: true,
      resultId: result._id.toString(),
      name: result.name,
      totalScore,
      maxScore,
      percentage,
      message: "Résultat sauvegardé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur submit-quiz:", error);
    return NextResponse.json(
      { error: "Erreur serveur : " + error.message },
      { status: 500 }
    );
  }
}
