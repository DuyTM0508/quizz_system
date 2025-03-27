import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FlashCardForm({ onSubmit, editingCard }) {
  const navigate = useNavigate();
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
    onSubmit({
      ...(editingCard && { _id: editingCard._id }),
      title,
      description,
      questions,
    });
    navigate(-1);
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <form onSubmit={handleSubmit}>
            <div
              className="card border-0 shadow-sm mb-4"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body p-4">
                <h2 className="card-title fw-bold text-primary mb-4">
                  {editingCard ? "Edit Flashcard" : "Create New Flashcard"}
                </h2>

                <div className="mb-4">
                  <label htmlFor="title" className="form-label fw-semibold">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Enter flashcard title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="form-control form-control-lg"
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="form-label fw-semibold"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Enter flashcard description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="form-control"
                    rows={3}
                    style={{ borderRadius: "8px" }}
                  />
                </div>
              </div>
            </div>

            <div
              className="card border-0 shadow-sm mb-4"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold text-primary mb-0">
                    <i className="bi bi-question-circle me-2"></i>Questions
                  </h3>
                  <span className="badge bg-primary rounded-pill">
                    {questions.length}{" "}
                    {questions.length === 1 ? "Question" : "Questions"}
                  </span>
                </div>

                {questions.length === 0 ? (
                  <div className="alert alert-info text-center" role="alert">
                    <i className="bi bi-info-circle me-2"></i>
                    No questions yet. Add your first question below!
                  </div>
                ) : (
                  <div className="mb-4">
                    {questions.map((question, qIndex) => (
                      <div
                        key={qIndex}
                        className="card mb-4 border-0 shadow-sm"
                        style={{ borderRadius: "10px" }}
                      >
                        <div
                          className="card-header bg-light d-flex align-items-center"
                          style={{ borderRadius: "10px 10px 0 0" }}
                        >
                          <span className="badge bg-primary rounded-pill me-2">
                            Q{qIndex + 1}
                          </span>
                          <h5 className="mb-0 flex-grow-1">Question</h5>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              setQuestions(
                                questions.filter((_, i) => i !== qIndex)
                              )
                            }
                            style={{ borderRadius: "6px" }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                        <div className="card-body p-4">
                          <div className="mb-4">
                            <input
                              type="text"
                              placeholder="Enter your question"
                              value={question.content}
                              onChange={(e) => {
                                const updated = [...questions];
                                updated[qIndex].content = e.target.value;
                                setQuestions(updated);
                              }}
                              className="form-control"
                              style={{ borderRadius: "8px" }}
                            />
                          </div>

                          <h6 className="fw-bold mb-3">
                            <i className="bi bi-list-check me-2"></i>
                            Answers
                            <span className="badge bg-secondary rounded-pill ms-2">
                              {question.answers?.length || 0}
                            </span>
                          </h6>

                          {question.answers &&
                            question.answers.map((answer, aIndex) => (
                              <div
                                key={aIndex}
                                className="card mb-2 border"
                                style={{
                                  borderRadius: "8px",
                                  borderLeft: answer.isCorrect
                                    ? "4px solid #198754"
                                    : "4px solid transparent",
                                }}
                              >
                                <div className="card-body p-3">
                                  <div className="row g-2 align-items-center">
                                    <div className="col-md-7">
                                      <input
                                        type="text"
                                        placeholder="Enter answer option"
                                        value={answer.content}
                                        onChange={(e) => {
                                          const updated = [...questions];
                                          updated[qIndex].answers[
                                            aIndex
                                          ].content = e.target.value;
                                          setQuestions(updated);
                                        }}
                                        className="form-control"
                                        style={{ borderRadius: "6px" }}
                                      />
                                    </div>
                                    <div className="col-md-3">
                                      <div className="form-check form-switch">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`correct-${qIndex}-${aIndex}`}
                                          checked={answer.isCorrect}
                                          onChange={(e) => {
                                            const updated = [...questions];
                                            updated[qIndex].answers[
                                              aIndex
                                            ].isCorrect = e.target.checked;
                                            setQuestions(updated);
                                          }}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={`correct-${qIndex}-${aIndex}`}
                                        >
                                          Correct
                                        </label>
                                      </div>
                                    </div>
                                    <div className="col-md-2 text-end">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = [...questions];
                                          updated[qIndex].answers.splice(
                                            aIndex,
                                            1
                                          );
                                          setQuestions(updated);
                                        }}
                                        className="btn btn-sm btn-outline-danger"
                                        style={{ borderRadius: "6px" }}
                                      >
                                        <i className="bi bi-x-lg"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}

                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...questions];
                              if (!updated[qIndex].answers) {
                                updated[qIndex].answers = [];
                              }
                              updated[qIndex].answers.push({
                                content: "",
                                isCorrect: false,
                              });
                              setQuestions(updated);
                            }}
                            className="btn btn-sm btn-outline-primary mt-3"
                            style={{ borderRadius: "6px" }}
                          >
                            <i className="bi bi-plus-lg me-1"></i> Add Answer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setQuestions([...questions, { content: "", answers: [] }])
                  }
                  className="btn btn-primary w-100 py-2"
                  style={{
                    borderRadius: "8px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(13, 110, 253, 0.25)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <i className="bi bi-plus-circle me-2"></i> Add New Question
                </button>
              </div>
            </div>

            <div
              className="card border-0 shadow-sm mb-4"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="btn btn-outline-secondary w-100 py-2"
                      style={{ borderRadius: "8px" }}
                    >
                      <i className="bi bi-arrow-left me-2"></i> Cancel
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      type="submit"
                      className="btn btn-success w-100 py-2"
                      style={{
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 8px rgba(25, 135, 84, 0.25)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      {editingCard ? "Update Flashcard" : "Create Flashcard"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FlashCardForm;
