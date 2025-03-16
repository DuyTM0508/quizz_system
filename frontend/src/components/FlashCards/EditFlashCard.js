import React, { useEffect, useState } from "react";
import FlashCardForm from "../../components/FlashCards/FlashCardForm";
import { useNavigate, useParams } from "react-router-dom";
import { getFlashcardById, updateFlashcard } from "../../api/flashcardApi";

const EditFlashcard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [flashcard, setFlashcard] = useState(null);

    useEffect(() => {
        const fetchFlashcard = async () => {
            try {
                const data = await getFlashcardById(id);
                setFlashcard(data);
            } catch (error) {
                console.error("Failed to fetch flashcard", error);
            }
        };
        fetchFlashcard();
    }, [id]);

    const handleUpdateFlashcard = async (updatedFlashcard) => {
        try {
            await updateFlashcard(id, updatedFlashcard);
            navigate("/admin/flashcards");
        } catch (error) {
            console.error("Failed to update flashcard", error);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Edit Flashcard</h1>
            {flashcard ? <FlashCardForm onSubmit={handleUpdateFlashcard} editingCard={flashcard} /> : <p>Loading...</p>}
        </div>
    );
};

export default EditFlashcard;
