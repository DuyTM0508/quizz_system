const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: [arr => arr.length >= 2, 'At least two options required'],
    },
    correctAnswer: {
      type: String,
      required: true,
    }
  },
  { _id: false } // Không tạo _id riêng cho mỗi câu hỏi nếu không cần
);

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    questions: [questionSchema]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Exam", examSchema);
