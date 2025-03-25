const Flashcard = require("../models/flashcardModel");

exports.getAllFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find();
    res.status(200).json(flashcards);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving flashcards" });
  }
};

exports.getFlashcardById = async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);
    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }
    res.status(200).json(flashcard);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving flashcard" });
  }
};

exports.createFlashcard = async (req, res) => {
  try {
    const newFlashcard = new Flashcard({
      title: req.body.title,
      description: req.body.description,
      questions: req.body.questions,
      createdBy: req.createdBy, // Lấy từ token
    });
    const savedFlashcard = await newFlashcard.save();
    res.status(201).json(savedFlashcard);
  } catch (error) {
    res.status(500).json({ message: "Error creating flashcard" });
  }
};

exports.updateFlashcard = async (req, res) => {
  try {
    const updatedFlashcard = await Flashcard.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFlashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }
    res.status(200).json(updatedFlashcard);
  } catch (error) {
    res.status(500).json({ message: "Error updating flashcard" });
  }
};

exports.deleteFlashcard = async (req, res) => {
  try {
    const deletedFlashcard = await Flashcard.findByIdAndDelete(req.params.id);
    if (!deletedFlashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }
    res.status(200).json({ message: "Flashcard deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting flashcard" });
  }
};
