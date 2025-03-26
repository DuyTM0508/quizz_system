const Exam = require('../models/examModel');
const mongoose = require('mongoose');

// Create exam
exports.createExam = async (req, res) => {
  try {
    let { title, description, category, duration, totalQuestions, hidden } = req.body;

    // Ép kiểu
    duration = Number(duration);
    totalQuestions = Number(totalQuestions);

    // Validate
    if (
      !title?.trim() ||
      !category?.trim() ||
      isNaN(duration) ||
      isNaN(totalQuestions)
    ) {
      return res.status(400).json({ EC: 1, EM: 'Missing or invalid fields' });
    }

    const exam = new Exam({
      title: title.trim(),
      description: description?.trim() || '',
      category: category.trim(),
      duration,
      totalQuestions,
      hidden: hidden === true // hoặc false nếu không truyền
    });

    await exam.save();
    res.status(201).json({ EC: 0, EM: 'Exam created successfully', DT: exam });
  } catch (err) {
    res.status(400).json({ EC: -1, EM: err.message });
  }
};

// Get all exams (with pagination)
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

// Get exam by ID
exports.getExamById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ EC: 1, EM: 'Invalid exam ID' });
    }

    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ EC: 1, EM: 'Exam not found' });
    }

    res.status(200).json({ EC: 0, EM: 'Success', DT: exam });
  } catch (err) {
    res.status(500).json({ EC: -1, EM: err.message });
  }
};

// Update exam
exports.updateExam = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ EC: 1, EM: 'Invalid exam ID' });
    }

    const updated = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ EC: 1, EM: 'Exam not found' });
    }

    res.status(200).json({ EC: 0, EM: 'Exam updated successfully', DT: updated });
  } catch (err) {
    res.status(500).json({ EC: -1, EM: err.message });
  }
};

// Delete exam
exports.deleteExam = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ EC: 1, EM: 'Invalid exam ID' });
    }

    const deleted = await Exam.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ EC: 1, EM: 'Exam not found' });
    }

    res.status(200).json({ EC: 0, EM: 'Exam deleted successfully' });
  } catch (err) {
    res.status(500).json({ EC: -1, EM: err.message });
  }
};
