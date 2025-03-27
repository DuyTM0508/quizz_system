import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFlashcardById } from "../../api/flashcardApi";
import * as bootstrap from "bootstrap";

const FlashCardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flashcard, setFlashcard] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const fetchFlashcard = async () => {
      try {
        setLoading(true);
        const data = await getFlashcardById(id);
        setFlashcard(data);
      } catch (error) {
        console.error("Error fetching flashcard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcard();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!flashcard || !flashcard.questions) return;
      if (e.code === "Space") {
        e.preventDefault();
        toggleAnswers();
      } else if (e.code === "ArrowRight") {
        nextQuestion();
      } else if (e.code === "ArrowLeft") {
        previousQuestion();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flashcard, currentQuestionIndex]);

  const toggleAnswers = () => {
    setFlipped(true);
    setTimeout(() => {
      setShowCorrectAnswers((prev) => !prev);
      setFlipped(false);
    }, 300);
  };

  const nextQuestion = () => {
    if (!flashcard || !flashcard.questions) return;
    if (currentQuestionIndex < flashcard.questions.length - 1) {
      setFlipped(true);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setShowCorrectAnswers(false);
        setFlipped(false);
      }, 300);
    } else {
      // Using Bootstrap toast instead of alert
      const toastEl = document.getElementById("lastQuestionToast");
      if (toastEl) {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }
    }
  };

  const previousQuestion = () => {
    if (!flashcard || !flashcard.questions) return;
    if (currentQuestionIndex > 0) {
      setFlipped(true);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev - 1);
        setShowCorrectAnswers(false);
        setFlipped(false);
      }, 300);
    } else {
      // Using Bootstrap toast instead of alert
      const toastEl = document.getElementById("firstQuestionToast");
      if (toastEl) {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "300px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!flashcard) {
    return (
      <div className="alert alert-warning text-center" role="alert">
        Could not load flashcard. Please try again later.
      </div>
    );
  }

  if (!flashcard.questions || flashcard.questions.length === 0) {
    return (
      <div className="alert alert-info text-center" role="alert">
        This flashcard doesn't have any questions.
      </div>
    );
  }

  const currentQuestion = flashcard.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / flashcard.questions.length) * 100;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div
            className="card border-0 shadow-sm mb-4"
            style={{ borderRadius: "15px" }}
          >
            <div className="card-body p-4">
              <h2 className="card-title text-center fw-bold text-primary mb-4">
                {flashcard.title}
              </h2>

              {/* Progress bar */}
              <div
                className="progress mb-4"
                style={{ height: "8px", borderRadius: "4px" }}
              >
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge bg-primary rounded-pill px-3 py-2">
                  Question {currentQuestionIndex + 1} of{" "}
                  {flashcard.questions.length}
                </span>
                <div className="text-muted small">
                  <i className="bi bi-info-circle me-1"></i>
                  Click card to reveal answers
                </div>
              </div>

              {/* Flashcard */}
              <div
                className="card border-0 shadow mb-4"
                onClick={toggleAnswers}
                style={{
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform: flipped ? "rotateY(90deg)" : "rotateY(0)",
                  minHeight: "300px",
                }}
              >
                <div className="card-body p-4">
                  <div className="text-center mb-4">
                    <h3 className="fw-bold text-primary mb-3">
                      {currentQuestion.content}?
                    </h3>
                    <div className="badge bg-light text-dark mb-2">
                      {showCorrectAnswers
                        ? "Answers Revealed"
                        : "Click to Reveal Answers"}
                    </div>
                  </div>

                  <div className="list-group">
                    {currentQuestion.answers.map((answer, index) => (
                      <div
                        key={index}
                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                          showCorrectAnswers && answer.isCorrect
                            ? "list-group-item-success"
                            : ""
                        }`}
                        style={{
                          borderRadius: "8px",
                          marginBottom: "8px",
                          borderLeft:
                            showCorrectAnswers && answer.isCorrect
                              ? "4px solid #198754"
                              : "4px solid transparent",
                        }}
                      >
                        <span>{answer.content}</span>
                        {showCorrectAnswers && answer.isCorrect && (
                          <span className="badge bg-success rounded-pill">
                            <i className="bi bi-check-lg"></i>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="d-flex justify-content-between">
                <button
                  onClick={previousQuestion}
                  className="btn btn-outline-secondary d-flex align-items-center"
                  disabled={currentQuestionIndex === 0}
                  style={{
                    borderRadius: "8px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    if (currentQuestionIndex !== 0) {
                      e.currentTarget.style.transform = "translateX(-3px)";
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <i className="bi bi-arrow-left me-2"></i> Previous
                </button>

                <button
                  onClick={() => navigate("/flashcards")}
                  className="btn btn-light"
                  style={{ borderRadius: "8px" }}
                >
                  <i className="bi bi-grid me-2"></i> All Cards
                </button>

                <button
                  onClick={nextQuestion}
                  className="btn btn-primary d-flex align-items-center"
                  disabled={
                    currentQuestionIndex === flashcard.questions.length - 1
                  }
                  style={{
                    borderRadius: "8px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    if (
                      currentQuestionIndex !==
                      flashcard.questions.length - 1
                    ) {
                      e.currentTarget.style.transform = "translateX(3px)";
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  Next <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Keyboard shortcuts info */}
          <div
            className="card border-0 bg-light"
            style={{ borderRadius: "10px" }}
          >
            <div className="card-body p-3">
              <h5 className="card-title fw-bold mb-3">
                <i className="bi bi-keyboard me-2"></i> Keyboard Shortcuts
              </h5>
              <div className="row">
                <div className="col-md-4">
                  <div className="d-flex align-items-center mb-2">
                    <span
                      className="badge bg-dark me-2"
                      style={{ minWidth: "60px" }}
                    >
                      Space
                    </span>
                    <span>Flip Card</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center mb-2">
                    <span
                      className="badge bg-dark me-2"
                      style={{ minWidth: "60px" }}
                    >
                      ←
                    </span>
                    <span>Previous</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center mb-2">
                    <span
                      className="badge bg-dark me-2"
                      style={{ minWidth: "60px" }}
                    >
                      →
                    </span>
                    <span>Next</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        <div
          id="firstQuestionToast"
          className="toast align-items-center text-white bg-primary border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">
              <i className="bi bi-info-circle me-2"></i> This is the first
              question!
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>

        <div
          id="lastQuestionToast"
          className="toast align-items-center text-white bg-primary border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">
              <i className="bi bi-info-circle me-2"></i> You've reached the last
              question!
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCardDetail;
