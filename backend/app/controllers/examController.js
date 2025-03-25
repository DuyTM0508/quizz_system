const Exam = require('../models/examModel');
const mongoose = require('mongoose');

exports.createExam = async (req, res) => {
    try {
        const { title, description, category, duration } = req.body;
        if (!title || !category || !duration) {
            return res.status(400).json({ EC: 1, EM: 'Missing required fields' });
        }
        const exam = new Exam(req.body);
        await exam.save();
        res.status(201).json({ EC: 0, EM: 'Exam created successfully', DT: exam });
    } catch (err) {
        res.status(400).json({ EC: -1, EM: err.message });
    }
};

exports.getExams = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const exams = await Exam.find()
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .exec();

        res.status(200).json({ EC: 0, EM: 'Fetched exams successfully', DT: exams });
    } catch (err) {
        res.status(500).json({ EC: -1, EM: err.message });
    }
};

exports.getExamById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ EC: 1, EM: 'Invalid exam ID' });
        }

        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ EC: 1, EM: 'Exam not found' });

        res.status(200).json({ EC: 0, EM: 'Success', DT: exam });
    } catch (err) {
        res.status(500).json({ EC: -1, EM: err.message });
    }
};

exports.updateExam = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ EC: 1, EM: 'Invalid exam ID' });
        }

        const updated = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ EC: 1, EM: 'Exam not found' });

        res.status(200).json({ EC: 0, EM: 'Exam updated successfully', DT: updated });
    } catch (err) {
        res.status(500).json({ EC: -1, EM: err.message });
    }
};

exports.deleteExam = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ EC: 1, EM: 'Invalid exam ID' });
        }

        const deleted = await Exam.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ EC: 1, EM: 'Exam not found' });

        res.status(200).json({ EC: 0, EM: 'Exam deleted successfully' });
    } catch (err) {
        res.status(500).json({ EC: -1, EM: err.message });
    }
};
