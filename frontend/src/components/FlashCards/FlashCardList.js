import React from "react";
import { useNavigate } from "react-router-dom";

function FlashCardList({ flashcards = [], onDelete }) {
    const navigate = useNavigate();

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this flashcard?")) {
            onDelete(id);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold my-4">Your Flashcards</h2>
            {flashcards.length === 0 ? (
                <p>No flashcards available. Create your first one!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {flashcards.map((card) => (
                        <div
                            key={card._id}
                            onClick={() => navigate(`/flashcards/view/${card._id}`)}
                            className="border rounded-xl shadow p-4 flex flex-col justify-between cursor-pointer hover:shadow-lg transition"
                        >
                            <h3 className="font-semibold text-lg">{card.title}</h3>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {card.description}
                            </p>
                            <p className="mt-2 text-sm">Questions: {card.questions?.length || 0}</p>
                            <div
                                className="flex justify-between mt-4"
                                onClick={(e) => e.stopPropagation()} // Ngăn chặn click vào card khi bấm nút
                            >
                                <button
                                    onClick={() => navigate(`/flashcards/edit/${card._id}`)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                >
                                    ✏ Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(card._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    🗑 Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FlashCardList;
