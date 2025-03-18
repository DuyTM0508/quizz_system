import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFlashcardById, updateFlashcard, getFlashcards } from "../../api/flashcardApi";
import FlashCardForm from "./FlashCardForm";

const EditFlashcard = ({ setFlashcards }) => {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate();
    const [flashcard, setFlashcard] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getFlashcardById(id);
                setFlashcard(data);
            } catch (error) {
                console.error("Error fetching flashcard:", error);
            }
        };
        fetchData();
    }, [id]);

    const handleSave = async (updatedCard) => {
        await updateFlashcard(id, updatedCard);

        // Lấy lại danh sách flashcards từ server sau khi cập nhật
        const updatedFlashcards = await getFlashcards();
        setFlashcards(updatedFlashcards);

        navigate("/flashcards"); // Quay về danh sách flashcards
    };

    return (
        <div>
            <h2>Edit Flashcard</h2>
            {flashcard ? (
                <FlashCardForm onSubmit={handleSave} editingCard={flashcard} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default EditFlashcard;
