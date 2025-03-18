const API_URL = "http://localhost:5000/flashcards"; // Đổi URL nếu cần

// Lấy danh sách flashcards
export const getFlashcards = async () => {
    const response = await fetch(API_URL);
    return response.json();
};

// Lấy một flashcard theo ID
export const getFlashcardById = async (id) => {
    try {
        console.log("Gửi yêu cầu lấy flashcard với ID:", id); // Kiểm tra ID trước khi gọi API
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error(`Không thể lấy flashcard. Mã lỗi: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching flashcard:", error);
        throw error;
    }
};


// Cập nhật flashcard (bao gồm câu hỏi và câu trả lời)
export const updateFlashcard = async (id, updatedData) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });
    return response.json();
};

// Thêm flashcard mới
export const addFlashcard = async (newData) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
    });
    return response.json();
};

// Xóa flashcard
export const deleteFlashcard = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};
