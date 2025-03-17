import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FlashCardForm({ onSubmit, editingCard }) {
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (editingCard) {
      setTitle(editingCard.title || "");
      setDescription(editingCard.description || "");
      setQuestions(editingCard.questions || []);
    }
  }, [editingCard]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, questions });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-6 p-6 bg-white shadow-lg rounded-lg"
    >
      <h2 className="text-2xl font-bold">
        {editingCard ? "Edit Flashcard" : "Create Flashcard"}
      </h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />

      <div>
        <h3 className="text-xl font-semibold">Questions</h3>
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="border p-4 rounded my-3 bg-gray-100">
            <input
              type="text"
              placeholder="Question"
              value={question.content}
              onChange={(e) => {
                const updated = [...questions];
                updated[qIndex].content = e.target.value;
                setQuestions(updated);
              }}
              className="w-full border p-2 rounded mb-2"
            />

            <div className="space-y-2">
              {question.answers.map((answer, aIndex) => (
                <div key={aIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Answer"
                    value={answer.content}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIndex].answers[aIndex].content = e.target.value;
                      setQuestions(updated);
                    }}
                    className="flex-1 border p-2 rounded"
                  />

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={answer.isCorrect}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[qIndex].answers[aIndex].isCorrect =
                          e.target.checked;
                        setQuestions(updated);
                      }}
                    />
                    <span>Correct</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...questions];
                      updated[qIndex].answers.splice(aIndex, 1);
                      setQuestions(updated);
                    }}
                    className="text-red-500"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const updated = [...questions];
                updated[qIndex].answers.push({ content: "", isCorrect: false });
                setQuestions(updated);
              }}
              className="mt-2 text-blue-500"
            >
              ➕ Add Answer
            </button>

            <button
              type="button"
              onClick={() =>
                setQuestions(questions.filter((_, i) => i !== qIndex))
              }
              className="mt-2 text-red-500 block"
            >
              ❌ Delete Question
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setQuestions([...questions, { content: "", answers: [] }])
          }
          className="mt-4 text-blue-500"
        >
          ➕ Add Question
        </button>
      </div>

      <div className="flex justify-between">
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          {editingCard ? "Update Flashcard" : "Create Flashcard"}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-black py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default FlashCardForm;
