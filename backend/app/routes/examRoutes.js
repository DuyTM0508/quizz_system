const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");


// Routes for Exam CRUD
router.post("/", examController.createExam);
router.get("/", examController.getExams);
router.get("/:id", examController.getExamById);
router.put("/:id", examController.updateExam);
router.delete("/:id", examController.deleteExam);

module.exports = router;
