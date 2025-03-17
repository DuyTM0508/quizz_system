import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFlashcardById } from "../../api/flashcardApi";

const FlashCardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [flashcard, setFlashcard] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);

    useEffect(() => {
        const fetchFlashcard = async () => {
            try {
                const data = await getFlashcardById(id);
                setFlashcard(data);
            } catch (error) {
                console.error("Error fetching flashcard:", error);
            }
        };
        fetchFlashcard();
    }, [id]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === "Space") {
                e.preventDefault();
                setShowCorrectAnswers((prev) => !prev); // Chuyển đổi giữa hiển thị đáp án đúng
            } else if (e.code === "ArrowRight") {
                nextQuestion();
            } else if (e.code === "ArrowLeft") {
                previousQuestion();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentQuestionIndex]);

    const nextQuestion = () => {
        if (currentQuestionIndex < flashcard.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setShowCorrectAnswers(false); // Đặt lại hiển thị đáp án đúng
        } else {
            alert("Bạn đã đến câu hỏi cuối!");
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
            setShowCorrectAnswers(false); // Đặt lại hiển thị đáp án đúng
        } else {
            alert("Đây là câu hỏi đầu tiên!");
        }
    };

    if (!flashcard) return <p>Loading...</p>;
    if (!flashcard.questions || flashcard.questions.length === 0) {
        return <p>Flashcard này không có câu hỏi nào.</p>;
    }

    const currentQuestion = flashcard.questions[currentQuestionIndex];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <h2 className="text-3xl font-bold mb-6">{flashcard.title}</h2>

            <div
                className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg text-center cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setShowCorrectAnswers((prev) => !prev)} // Nhấp vào để hiện đáp án đúng
            >
                <h3 className="text-xl font-semibold mb-2">
                    Question {currentQuestionIndex + 1} of {flashcard.questions.length}
                </h3>

                <p className="text-lg mb-4">{currentQuestion.content}?</p>

                <h4 className="text-lg font-medium mb-2"></h4>
                <ul className="text-left">
                    {currentQuestion.answers.map((answer, index) => (
                        <li key={index} className={`flex justify-between ${showCorrectAnswers ? (answer.isCorrect ? "text-green-600" : "text-red-600") : ""}`}>
                            {answer.content} {showCorrectAnswers && answer.isCorrect ? "✅" : ""}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex mt-6 gap-4">
                <button
                    onClick={previousQuestion}
                    className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    disabled={currentQuestionIndex === 0}
                >
                    ← Previous
                </button>
                <button
                    onClick={nextQuestion}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    disabled={currentQuestionIndex === flashcard.questions.length - 1}
                >
                    Next →
                </button>
                <button
                    onClick={() => navigate("/flashcards")}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                    Back to List
                </button>
            </div>
        </div>
    );
};

export default FlashCardDetail;