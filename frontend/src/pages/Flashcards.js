import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import {
  getFlashcards,
  getFlashcardById,
  addFlashcard,
  updateFlashcard,
} from "../api/flashcardApi";
import FlashCardList from "../components/FlashCards/FlashCardList";
import FlashCardForm from "../components/FlashCards/FlashCardForm";
import FlashCardDetail from "../components/FlashCards/FlashCardDetail";
const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy id từ URL nếu có (dùng khi chỉnh sửa)

  // Lấy danh sách flashcards khi trang được tải
  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      const data = await getFlashcards();
      if (data) setFlashcards(data);
    } catch (error) {
      console.error("Failed to load flashcards", error);
    }
  };

  // Lấy dữ liệu của flashcard nếu đang ở chế độ chỉnh sửa
  const [editingCard, setEditingCard] = useState(null);

  useEffect(() => {
    if (id) {
      loadFlashcardById(id);
    }
  }, [id]);

  const loadFlashcardById = async (id) => {
    try {
      const data = await getFlashcardById(id);
      setEditingCard(data);
    } catch (error) {
      console.error("Error fetching flashcard:", error);
    }
  };

  // Hàm xử lý lưu flashcard (cả tạo mới và chỉnh sửa)
  const handleSave = async (card) => {
    try {
      if (card._id) {
        // Cập nhật flashcard đã tồn tại
        await updateFlashcard(card._id, card);
        setFlashcards((prev) =>
          prev.map((c) => (c._id === card._id ? card : c))
        );
      } else {
        // Thêm flashcard mới
        const newFlashcard = await addFlashcard(card);
        setFlashcards((prev) => [...prev, newFlashcard]);
      }
      navigate("/flashcard"); // Sau khi lưu, quay lại trang danh sách flashcards
    } catch (error) {
      console.error("Error saving flashcard:", error);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <button
              onClick={() => navigate("/flashcards/create")}
              className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
              Create Flashcard
            </button>
            <FlashCardList flashcards={flashcards} />
          </>
        }
      />

      {/* Trang tạo mới và chỉnh sửa flashcard */}
      <Route path="create" element={<FlashCardForm onSubmit={handleSave} />} />
      <Route
        path="edit/:id"
        element={
          <FlashCardForm onSubmit={handleSave} editingCard={editingCard} />
        }
      />
      <Route path="view/:id" element={<FlashCardDetail />} />
    </Routes>
  );
};

export default Flashcards;
