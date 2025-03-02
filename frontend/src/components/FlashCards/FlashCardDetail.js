import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFlashcardById } from "../../api/flashcardApi";

const FlashCardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [flashcard, setFlashcard] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

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
                setShowAnswer((prev) => !prev);
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
            setShowAnswer(false);
        } else {
            alert("You've reached the end!");
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
            setShowAnswer(false);
        } else {
            alert("This is the first question!");
        }
    };

    if (!flashcard) return <p>Loading...</p>;

    const currentQuestion = flashcard.questions[currentQuestionIndex];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h2 className="text-2xl font-bold mb-4">{flashcard.title}</h2>

            <div
                className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg text-center cursor-pointer"
                onClick={() => setShowAnswer(!showAnswer)}
            >
                <h3 className="text-lg font-semibold mb-2">
                    Question {currentQuestionIndex + 1} of {flashcard.questions.length}
                </h3>

                {!showAnswer ? (
                    <p className="text-xl">{currentQuestion.content}</p>
                ) : (
                    <div>
                        <h4 className="text-lg font-medium mb-2">Answers:</h4>
                        <ul className="text-left">
                            {currentQuestion.answers.map((answer, index) => (
                                <li key={index} className={answer.isCorrect ? "text-green-600" : ""}>
                                    {answer.content} {answer.isCorrect ? "✅" : ""}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
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
