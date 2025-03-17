const API_URL = "http://localhost:8080/flashcards";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZDU0N2UxNTEwZjY2ZGRiYzZhNGU1MCIsImlhdCI6MTc0MjExOTQ0MywiZXhwIjoxNzQyMjA1ODQzfQ.zferSp1_vYDx4Nzj4LuE8z_Q_n-tBw8uYeX1wJ_a1xE" ;
// Lấy danh sách flashcards
export const getFlashcards = async () => {
    const response = await fetch(API_URL);
    return response.json();
};

// Lấy một flashcard theo ID
export const getFlashcardById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error(`Lỗi khi lấy flashcard: ${response.status}`);
    return response.json();
};

// Thêm flashcard mới
export const addFlashcard = async (newData) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newData),
    });
    return response.json();
};

// Cập nhật flashcard
export const updateFlashcard = async (id, updatedData) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
    });
    return response.json();
};

// Xóa flashcard
// export const deleteFlashcard = async (id) => {
//     await fetch(`${API_URL}/${id}`, {
//         method: "DELETE",
//         headers: {
//             "Authorization": `Bearer ${token}`
//         }
//     });
// };

// Xóa flashcard
export const deleteFlashcard = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        console.error("Lỗi khi xóa flashcard:", response.status);
        if (response.status === 401) {
            console.error("Token không hợp lệ.");
        }
        throw new Error("Không thể xóa flashcard.");
    }

    // Trả về phản hồi nếu xóa thành công
    return response.json(); // Hoặc chỉ cần return một giá trị như { message: "Flashcard deleted successfully" }
};