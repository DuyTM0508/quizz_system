const express = require("express");
const flashcardRouter = express.Router();
const flashcardController = require("../controllers/flashcardController");
const { authJwt } = require("../middlewares");

flashcardRouter.get("/", flashcardController.getAllFlashcards);
flashcardRouter.get("/:id", flashcardController.getFlashcardById); 
flashcardRouter.post("/", authJwt.verifyToken, flashcardController.createFlashcard);
// flashcardRouter.put("/:id", authJwt.verifyToken, authJwt.isAdminOrOwner, flashcardController.updateFlashcard);
flashcardRouter.put("/:id", authJwt.verifyToken, flashcardController.updateFlashcard);
// flashcardRouter.delete("/:id", authJwt.verifyToken, authJwt.isAdminOrOwner, flashcardController.deleteFlashcard);
flashcardRouter.delete("/:id", authJwt.verifyToken, flashcardController.deleteFlashcard);

module.exports = flashcardRouter;
