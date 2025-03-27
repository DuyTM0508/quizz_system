import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import {
  getFlashcards,
  getFlashcardById,
  addFlashcard,
  updateFlashcard,
} from "../api/flashcardApi";
import FlashCardList from "../components/FlashCards/FlashCardList";
import FlashCardForm from "../components/FlashCards/FlashCardForm";
import FlashCardDetail from "../components/FlashCards/FlashCardDetail";

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // Fetch flashcards when page loads
  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      setLoading(true);
      const data = await getFlashcards();
      if (data) setFlashcards(data);
    } catch (error) {
      console.error("Failed to load flashcards", error);
    } finally {
      setLoading(false);
    }
  };

  // Get flashcard data if in edit mode
  const [editingCard, setEditingCard] = useState(null);

  useEffect(() => {
    if (id) {
      loadFlashcardById(id);
    }
  }, [id]);

  const loadFlashcardById = async (id) => {
    try {
      setLoading(true);
      const data = await getFlashcardById(id);
      setEditingCard(data);
    } catch (error) {
      console.error("Error fetching flashcard:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle saving flashcard (both create and edit)
  const handleSave = async (card) => {
    try {
      setLoading(true);
      if (card._id) {
        // Update existing flashcard
        await updateFlashcard(card._id, card);
        setFlashcards((prev) =>
          prev.map((c) => (c._id === card._id ? card : c))
        );
      } else {
        // Add new flashcard
        const newFlashcard = await addFlashcard(card);
        setFlashcards((prev) => [...prev, newFlashcard]);
      }
      navigate("/flashcards"); // Return to flashcard list after saving
    } catch (error) {
      console.error("Error saving flashcard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid py-4 mt-20"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <div className="container">
              <div className="row mb-4">
                <div className="col-12">
                  <div
                    className="card border-0"
                    style={{
                      borderRadius: "15px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div className="card-body d-flex justify-content-between align-items-center p-4">
                      <div>
                        <h1 className="mb-0 fw-bold text-primary">
                          Flashcards
                        </h1>
                        <p className="text-muted mb-0">
                          Manage your learning materials
                        </p>
                      </div>
                      <button
                        onClick={() => navigate("/flashcards/create")}
                        className="btn btn-primary d-flex align-items-center"
                        style={{
                          borderRadius: "8px",
                          padding: "10px 20px",
                          boxShadow: "0 4px 6px rgba(13, 110, 253, 0.25)",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 8px rgba(13, 110, 253, 0.3)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 6px rgba(13, 110, 253, 0.25)";
                        }}
                      >
                        <i className="bi bi-plus-circle me-2"></i> Create
                        Flashcard
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="d-flex justify-content-center my-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <FlashCardList flashcards={flashcards} />
              )}
            </div>
          }
        />

        {/* Create and edit flashcard pages */}
        <Route
          path="create"
          element={
            <div className="container">
              <div className="row mb-4">
                <div className="col-12">
                  <div
                    className="card border-0"
                    style={{
                      borderRadius: "15px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-4">
                        <button
                          onClick={() => navigate(-1)}
                          className="btn btn-outline-secondary me-3"
                          style={{ borderRadius: "8px" }}
                        >
                          <i className="bi bi-arrow-left"></i>
                        </button>
                        <h2 className="mb-0 fw-bold text-primary">
                          Create New Flashcard
                        </h2>
                      </div>
                      {loading ? (
                        <div className="d-flex justify-content-center my-5">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <FlashCardForm onSubmit={handleSave} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        />

        <Route
          path="edit/:id"
          element={
            <div className="container">
              <div className="row mb-4">
                <div className="col-12">
                  <div
                    className="card border-0"
                    style={{
                      borderRadius: "15px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-4">
                        <button
                          onClick={() => navigate("/flashcard")}
                          className="btn btn-outline-secondary me-3"
                          style={{ borderRadius: "8px" }}
                        >
                          <i className="bi bi-arrow-left"></i>
                        </button>
                        <h2 className="mb-0 fw-bold text-primary">
                          Edit Flashcard
                        </h2>
                      </div>
                      {loading ? (
                        <div className="d-flex justify-content-center my-5">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <FlashCardForm
                          onSubmit={handleSave}
                          editingCard={editingCard}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        />

        <Route
          path="view/:id"
          element={
            <div className="container">
              <div className="row mb-4">
                <div className="col-12">
                  <div
                    className="card border-0"
                    style={{
                      borderRadius: "15px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-4">
                        <button
                          onClick={() => navigate("/flashcard")}
                          className="btn btn-outline-secondary me-3"
                          style={{ borderRadius: "8px" }}
                        >
                          <i className="bi bi-arrow-left"></i>
                        </button>
                        <h2 className="mb-0 fw-bold text-primary">
                          Flashcard Details
                        </h2>
                      </div>
                      {loading ? (
                        <div className="d-flex justify-content-center my-5">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <FlashCardDetail />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default Flashcards;
