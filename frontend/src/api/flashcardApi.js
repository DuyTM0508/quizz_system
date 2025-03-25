import axios from "../utils/axiosCustomize";
const getFlashcards = () => {
  return axios.get("flashcards");
};

// Lấy một flashcard theo ID
export const getFlashcardById = (id) => {
  return axios.get("flashcards/" + id);
};

// Thêm flashcard mới
const addFlashcard = (newData) => {
  return axios.post("flashcards", newData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Cập nhật flashcard
export const updateFlashcard = async (id, updatedData) => {
  return axios.put("flashcards/" + id, updatedData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Xóa flashcard
export const deleteFlashcard = (id) => {
  return axios.delete("flashcards/" + id);
};
export { getFlashcards, addFlashcard };
