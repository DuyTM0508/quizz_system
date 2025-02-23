import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { getFlashcards, addFlashcard, updateFlashcard, deleteFlashcard } from "../api/flashcardApi";
import FlashCardForm from "../components/FlashCardForm";
import FlashCardList from "../components/FlashCardList";
import EditFlashcard from "../components/EditFlashCard"

const Flashcards = () => {
    const [flashcards, setFlashcards] = useState([]);

    useEffect(() => {
        loadFlashcards();
    }, []);

    const loadFlashcards = async () => {
        setFlashcards(await getFlashcards());
    };

    const handleSave = async (card) => {
        if (card._id) {
            await updateFlashcard(card._id, card);
        } else {
            await addFlashcard(card);
        }
        loadFlashcards();
    };

    const handleDelete = async (id) => {
        await deleteFlashcard(id);
        loadFlashcards();
    };

    return (
        <Routes>
            {/* Danh sách flashcards */}
            <Route
                path="/"
                element={
                    <>
                        <FlashCardForm onSubmit={handleSave} />
                        <FlashCardList flashcards={flashcards} onDelete={handleDelete} />
                    </>
                }
            />
            {/* Trang chỉnh sửa flashcard */}
            <Route path="edit/:id" element={<EditFlashcard setFlashcards={setFlashcards} />} />
        </Routes>
    );
};

export default Flashcards;
