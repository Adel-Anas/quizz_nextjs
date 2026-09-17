import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  questionType: { type: String, required: true },
  answer: { type: mongoose.Schema.Types.Mixed },
  isCorrect: { type: Boolean, required: true },
  points: { type: Number, required: true },
  constraintDetails: { type: mongoose.Schema.Types.Mixed },
});

const QuizResultSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    answers: [AnswerSchema],
    totalScore: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    percentage: { type: Number, required: true },
    timeSpent: { type: Number, default: 0 },
    aiAnalysis: { type: String, default: "" },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.QuizResult ||
  mongoose.model("QuizResult", QuizResultSchema);
