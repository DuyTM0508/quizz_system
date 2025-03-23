const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    category: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    hidden: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
