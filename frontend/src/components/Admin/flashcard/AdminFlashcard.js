import React, { useState, useEffect } from "react";
import { getFlashcards } from "../../../api/flashcardApi";
import AdminFlashCardList from "./AdminFlashCardList";
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminFlashcard = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const data = await getFlashcards();
      setFlashcards(data);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  // Lọc flashcards theo search
  const filteredFlashcards = flashcards.filter(flashcard => 
    flashcard.title.toLowerCase().includes(search.toLowerCase()) 
    || flashcard.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Flashcard Management</h1>
              <p className="text-blue-100">
                Manage your Flashcards, create new ones, and edit existing ones.
              </p>
            </div>
            <button
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-full font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
              onClick={() => navigate("/admin/flashcard/add")}
            >
              <Plus className="mr-2 h-5 w-5" /> Create New Flashcard
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search flashcards..."
                className="pl-10 w-full border border-gray-300 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <AdminFlashCardList flashcards={filteredFlashcards} setFlashcards={setFlashcards} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFlashcard;