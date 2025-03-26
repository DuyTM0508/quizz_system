import React, { useState } from "react";
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Your Flashcards
        </h2>
        <div className="relative mb-6 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search flashcards..."
            className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        {filteredFlashcards.length === 0 ? (
          <p className="text-center text-gray-600">
            No flashcards available. Create your first one!
          </p>
        ) : (
          <div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentFlashcards.map((card, index) => (
                <div
                  key={card._id || `flashcard-${index}`}
                  onClick={() => navigate(`/flashcards/view/${card._id}`)}
                  className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg cursor-pointer"
                >
                  <h3 className="text-xl font-semibold text-gray-800">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-gray-600 line-clamp-2">
                    {card.description}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Questions: {card.questions?.length || 0}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={handlePrev}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 flex items-center"
              >
                <FaChevronLeft className="mr-2" /> Prev
              </button>
              <button
                onClick={handleNext}
                disabled={
                  (currentPage + 1) * itemsPerPage >= filteredFlashcards.length
                }
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 flex items-center"
              >
                Next <FaChevronRight className="ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FlashCardList;
