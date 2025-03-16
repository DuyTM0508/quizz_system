import React from "react";
import FlashCardForm from "../../components/FlashCards/FlashCardForm";
import { useNavigate } from "react-router-dom";
import { addFlashcard } from "../../api/flashcardApi";

const AddFlashcard = () => {
    const navigate = useNavigate();

    const handleCreateFlashcard = async (flashcardData) => {
        try {
            await addFlashcard(flashcardData);
            navigate("/admin/flashcards");
        } catch (error) {
            console.error("Failed to create flashcard", error);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Create Flashcard</h1>
            <FlashCardForm onSubmit={handleCreateFlashcard} />
        </div>
    );
};

export default AddFlashcard;
