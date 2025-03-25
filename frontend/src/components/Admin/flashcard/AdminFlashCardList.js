import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteFlashcard } from "../../../api/flashcardApi";

const AdminFlashCardList = ({ flashcards, setFlashcards }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleDelete = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa flashcard này?`)) {
      return;
    }

    try {
      const response = await deleteFlashcard(id);
      if (response && response.message === "Flashcard deleted successfully") {
        alert("⚡ Flashcard đã xóa thành công!");
        setFlashcards((prevFlashcards) =>
          prevFlashcards.filter((card) => card._id !== id)
        );
      }
    } catch (error) {
      alert("❌ Lỗi khi xóa flashcard!");
    }
  };

  // Phân trang
  const totalPages = Math.ceil(flashcards.length / itemsPerPage);
  const displayedFlashcards = flashcards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium">Title</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Description</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Questions Count</th>
            <th className="px-6 py-3 text-center text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedFlashcards.map((flashcard) => (
            <tr key={flashcard._id} className="border-t">
              <td className="px-6 py-4">{flashcard.title}</td>
              <td className="px-6 py-4">{flashcard.description}</td>
              <td className="px-6 py-4">{flashcard.questions ? flashcard.questions.length : 0}</td>
              <td className="px-6 py-4 flex justify-center gap-4">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => navigate(`/admin/flashcard/edit/${flashcard._id}`)}
                >
                  <Edit />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(flashcard._id)}
                >
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Phân trang */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          className={`px-3 py-1 border rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="px-4 py-1 border rounded">Page {currentPage} of {totalPages}</span>
        <button
          className={`px-3 py-1 border rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminFlashCardList;
