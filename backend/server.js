const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const httpErrors = require("http-errors");
const dbConnection = require("./config/dbConnection");
const blogRouter = require("./routes/blog/Blog.routes");
dbConnection();

const app = express();
app.use(express.json());
app.use(cors());

// Schema câu hỏi
const QuestionSchema = new mongoose.Schema({
  content: String,
  answers: [
    {
      content: String,
      isCorrect: Boolean,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// Schema FlashCard (có nhiều câu hỏi)
const FlashCardSchema = new mongoose.Schema({
  title: String,
  description: String,
  questions: [QuestionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const FlashCard = mongoose.model("FlashCard", FlashCardSchema);

// API Routes
app.get("/flashcards", async (req, res) => {
  const flashcards = await FlashCard.find();
  res.json(flashcards);
});

app.get("/flashcards/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Nhận yêu cầu lấy flashcard với ID: ${id}`); // Log ID nhận được

    // Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("❌ ID không hợp lệ:", id);
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    // Tìm flashcard theo ID
    const flashcard = await FlashCard.findById(id);
    if (!flashcard) {
      console.error("❌ Flashcard không tồn tại:", id);
      return res.status(404).json({ message: "Flashcard không tồn tại" });
    }

    console.log("✅ Flashcard tìm thấy:", flashcard);
    res.json(flashcard);
  } catch (error) {
    console.error("🔥 Lỗi khi lấy flashcard:", error); // In lỗi chi tiết
    res.status(500).json({ message: "Lỗi server" });
  }
});

app.post("/flashcards", async (req, res) => {
  const { title, description, questions, createdBy } = req.body;
  const newCard = new FlashCard({ title, description, questions, createdBy });
  await newCard.save();
  res.json(newCard);
});

app.put("/flashcards/:id", async (req, res) => {
  const updatedCard = await FlashCard.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedCard);
});

app.delete("/flashcards/:id", async (req, res) => {
  await FlashCard.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

app.use("/blogs", blogRouter);

//Them middleware xu ly loi 404
app.use(async (req, res, next) => {
  next(httpErrors.BadRequest("Invalid route"));
});

//Kiem soat loi bat ki: 4x or 5x
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
  });
});

// Chạy server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
