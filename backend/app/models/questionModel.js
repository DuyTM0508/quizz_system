const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "Question text is required"],
        trim: true
    },
    type: {
        type: String,
        enum: ['single', 'multiple', 'true_false', 'short'],
        required: [true, "Question type is required"]
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true
    },
    options: [{
        text: { type: String, required: true },
        isCorrect: { type: Boolean, required: true }
    }], // Only for single/multiple choice
    correctAnswer: {
        type: String,
        required: function () { return this.type === 'short' || this.type === 'true_false'; }
    }, // For short answer & true/false
    hidden: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
