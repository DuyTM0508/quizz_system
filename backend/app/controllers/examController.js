const mongoose = require('mongoose');
const Exam = require('../models/examModel');

// ✅ Create new exam
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

// ✅ Get all exams with pagination
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

// ✅ Get exam by ID
exports.getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ EC: 1, EM: 'Invalid exam ID' });
    }

    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({ EC: 1, EM: 'Exam not found' });
    }

    res.status(200).json({ EC: 0, EM: 'Success', DT: exam });
  } catch (err) {
    res.status(500).json({ EC: -1, EM: err.message });
  }
};

// ✅ Update exam
exports.updateExam = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ EC: 1, EM: 'Invalid exam ID' });
    }

    const updated = await Exam.findByIdAndUpdate(id, req.body, {
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

// ✅ Delete exam
exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ EC: 1, EM: 'Invalid exam ID' });
    }

    const deleted = await Exam.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ EC: 1, EM: 'Exam not found' });
    }

    res.status(200).json({ EC: 0, EM: 'Exam deleted successfully' });
  } catch (err) {
    res.status(500).json({ EC: -1, EM: err.message });
  }
};

// ✅ Add a question to exam (nested)
exports.addQuestionToExam = async (req, res) => {
  try {
    const { examId, questionText, options, correctAnswer } = req.body;

    if (!mongoose.isValidObjectId(examId)) {
      return res.status(400).json({ EC: 1, EM: 'Invalid exam ID' });
    }

    const exam = await Exam.findByIdAndUpdate(
      examId,
      {
        $push: {
          questions: { questionText, options, correctAnswer }
        }
      },
      { new: true, runValidators: true }
    );

    if (!exam) {
      return res.status(404).json({ EC: 1, EM: 'Exam not found' });
    }

    res.status(200).json({ EC: 0, EM: 'Question added successfully', DT: exam });
  } catch (err) {
    res.status(500).json({ EC: -1, EM: err.message });
  }
};

// ✅ Delete question from exam
exports.deleteQuestionFromExam = async (req, res) => {
  try {
    const { id, questionText } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ EC: 1, EM: 'Invalid exam ID' });
    }

    const exam = await Exam.findByIdAndUpdate(
      id,
      {
        $pull: {
          questions: { questionText }
        }
      },
      { new: true }
    );

    if (!exam) {
      return res.status(404).json({ EC: 1, EM: 'Exam not found' });
    }

    res.status(200).json({ EC: 0, EM: 'Question deleted', DT: exam });
  } catch (err) {
    res.status(500).json({ EC: -1, EM: err.message });
  }
};
