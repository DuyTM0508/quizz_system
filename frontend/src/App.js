import React, { useState } from "react";
import "./App.css";
import QuestList from "./pages/QuestionList";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/questionlist" element={<QuestList />} />

        </Routes>
      </div>
    </Router>
  );
}
export default App;
