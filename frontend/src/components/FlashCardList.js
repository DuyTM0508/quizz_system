import React from "react";
import { useNavigate } from "react-router-dom";

function FlashCardList({ flashcards = [], onDelete }) {
    const navigate = useNavigate();

    return (
        <div>
            {flashcards.length === 0 ? (
                <p>No flashcards available. Create one!</p>
            ) : (
                flashcards.map((card) => (
                    <div key={card._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                        <h3>{card.title}</h3>
                        <h4>Questions: {card.questions?.length || 0}</h4> {/* Chỉ hiển thị số lượng câu hỏi */}
                        
                        <button onClick={() => navigate(`/flashcards/edit/${card._id}`)}>✏ Edit</button>
                        <button onClick={() => onDelete(card._id)}>🗑 Delete</button>
                    </div>
                ))
            )}
        </div>
    );
}

export default FlashCardList;
