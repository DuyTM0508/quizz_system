const express = require("express");
const flashcardRouter = express.Router();
const flashcardController = require("../controllers/flashcardController");
const {
  verifyToken,
  verifyTokenAndAuth,
} = require("../controllers/middlewareController");

flashcardRouter.get("/", flashcardController.getAllFlashcards);
flashcardRouter.get("/:id", flashcardController.getFlashcardById);
flashcardRouter.post("/", verifyToken, flashcardController.createFlashcard);
// flashcardRouter.put("/:id", authJwt.verifyToken, authJwt.isAdminOrOwner, flashcardController.updateFlashcard);
flashcardRouter.put("/:id", verifyToken, flashcardController.updateFlashcard);
// flashcardRouter.delete("/:id", authJwt.verifyToken, authJwt.isAdminOrOwner, flashcardController.deleteFlashcard);
flashcardRouter.delete(
  "/:id",
  verifyToken,
  flashcardController.deleteFlashcard
);

module.exports = flashcardRouter;