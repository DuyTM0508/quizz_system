const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");

// CRUD Exam
router.post("/", examController.createExam);
router.get("/", examController.getExams);
router.get("/:id", examController.getExamById);
router.put("/:id", examController.updateExam);
router.delete("/:id", examController.deleteExam);

// ➕ Thêm câu hỏi vào bài thi (theo mô hình nhúng)
router.post("/add-question", examController.addQuestionToExam);

// ❌ Xoá câu hỏi khỏi bài thi (theo questionText)
router.delete("/:id/delete-question/:questionText", examController.deleteQuestionFromExam);

module.exports = router;
