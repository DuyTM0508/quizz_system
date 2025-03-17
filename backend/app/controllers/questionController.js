const Question = require('../models/questionModel');
const mongoose = require('mongoose');

exports.createQuestion = async (req, res) => {
    try {
        // Validate request body
        if (!req.body.text || !req.body.type || !req.body.category) {
            return res.status(400).json({ error: 'Text, type, and category are required' });
        }

        const question = new Question(req.body);
        await question.save();
        res.status(201).json(question);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getQuestions = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default pagination
        const questions = await Question.find()
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .exec();

        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getQuestionById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid question ID' });
        }

        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });

        res.json(question);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid question ID' });
        }

        const validFields = ['text', 'type', 'category', 'options', 'correctAnswer', 'hidden'];
        const updates = Object.keys(req.body).filter(key => validFields.includes(key));

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!question) return res.status(404).json({ message: 'Question not found' });

        res.json(question);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid question ID' });
        }

        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });

        res.json({ message: 'Question deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
