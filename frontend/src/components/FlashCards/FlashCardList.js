import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";

function FlashCardList({ flashcards = [] }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 3;

  const handleNext = () => {
    if ((currentPage + 1) * itemsPerPage < flashcards.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredFlashcards = (flashcards || []).filter(
    (card) =>
      card?.title?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      card?.description?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  const currentFlashcards = filteredFlashcards.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Card hover style function to be used with onMouseOver/onMouseOut
  const [hoveredCardId, setHoveredCardId] = useState(null);

  return (
    <div className="container py-5" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div
            className="card border-0 mb-5"
            style={{
              boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
              borderRadius: "10px",
            }}
          >
            <div className="card-body p-4">
              <h2 className="display-6 text-center mb-4 fw-bold text-primary">
                Your Flashcards
              </h2>

              <div
                className="input-group mb-4 mx-auto"
                style={{
                  maxWidth: "500px",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <span
                  className="input-group-text bg-white"
                  style={{ borderColor: "#dee2e6" }}
                >
                  <FaSearch className="text-secondary" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search flashcards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ borderColor: "#dee2e6", boxShadow: "none" }}
                />
              </div>

              {filteredFlashcards.length === 0 ? (
                <div className="alert alert-info text-center">
                  No flashcards available. Create your first one!
                </div>
              ) : (
                <>
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
                    {currentFlashcards.map((card, index) => (
                      <div
                        className="col"
                        key={card._id || `flashcard-${index}`}
                      >
                        <div
                          className="card h-100 border-0"
                          onClick={() =>
                            navigate(`/flashcards/view/${card._id}`)
                          }
                          onMouseOver={() =>
                            setHoveredCardId(card._id || `flashcard-${index}`)
                          }
                          onMouseOut={() => setHoveredCardId(null)}
                          style={{
                            cursor: "pointer",
                            borderRadius: "10px",
                            boxShadow:
                              "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
                            transition: "all 0.3s ease",
                            transform:
                              hoveredCardId ===
                              (card._id || `flashcard-${index}`)
                                ? "translateY(-5px)"
                                : "translateY(0)",
                            boxShadow:
                              hoveredCardId ===
                              (card._id || `flashcard-${index}`)
                                ? "0 10px 20px rgba(0,0,0,0.1)"
                                : "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
                            borderColor:
                              hoveredCardId ===
                              (card._id || `flashcard-${index}`)
                                ? "#0d6efd"
                                : "transparent",
                          }}
                        >
                          <div className="card-body p-4">
                            <h5 className="card-title fw-bold text-truncate">
                              {card.title}
                            </h5>
                            <p
                              className="card-text text-secondary mb-3"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {card.description}
                            </p>
                            <div className="d-flex align-items-center">
                              <span
                                className="badge bg-primary rounded-pill"
                                style={{
                                  fontWeight: "500",
                                  padding: "6px 12px",
                                }}
                              >
                                {card.questions?.length || 0} Questions
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <nav aria-label="Flashcard navigation">
                    <ul className="pagination justify-content-center">
                      <li
                        className={`page-item ${
                          currentPage === 0 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link d-flex align-items-center"
                          onClick={handlePrev}
                          disabled={currentPage === 0}
                          style={{
                            color: "#0d6efd",
                            borderRadius: "5px",
                            margin: "0 5px",
                          }}
                        >
                          <FaChevronLeft className="me-1" size={12} /> Previous
                        </button>
                      </li>
                      <li
                        className={`page-item ${
                          (currentPage + 1) * itemsPerPage >=
                          filteredFlashcards.length
                            ? "disabled"
                            : ""
                        }`}
                      >
                        <button
                          className="page-link d-flex align-items-center"
                          onClick={handleNext}
                          disabled={
                            (currentPage + 1) * itemsPerPage >=
                            filteredFlashcards.length
                          }
                          style={{
                            color: "#0d6efd",
                            borderRadius: "5px",
                            margin: "0 5px",
                          }}
                        >
                          Next <FaChevronRight className="ms-1" size={12} />
                        </button>
                      </li>
                    </ul>
                  </nav>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlashCardList;
