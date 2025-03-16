// models/flashcardModel.js (V2)
const mongoose = require("mongoose");

const QuestionFlashcardSchema = new mongoose.Schema({
  content: String,
  answers: [
    {
      content: String,
      isCorrect: Boolean,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const FlashCardSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    questions: [QuestionFlashcardSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FlashCard", FlashCardSchema);
