import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import Admin from "./components/Admin/Admin";
import User from "./components/User/User";
import Homepage from "./components/Home/Homepage";
import Dashboard from "./components/Admin/Content/Dashboard";
import ManagerUser from "./components/Admin/Content/ManagerUser";
import Login from "./components/Auth/Login";
import App from "./App";
import { ToastContainer } from "react-toastify";
import Register from "./components/Auth/Register";
import Flashcards from "./pages/Flashcards";
import BlogPage from "./pages/blog/BlogPage";
import BlogDetail from "./pages/blog/BlogDetail";
import AdminBlog from "./pages/admin/blog";
import AddNewBlog from "./pages/admin/blog/components/AddNewBlog";
import AdminFlashcard from "./components/Admin/flashcard/AdminFlashcard";
import EditFlashcard from "./components/FlashCards/EditFlashCard";
import AddFlashcard from "./components/FlashCards/AddFlashcard";
import ProtectedRoute from "./pages/ProtectedRoute";
import ExamList from "./pages/ExamList";


const Layout = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="user" element={<User />} />
          <Route index element={<Homepage />} />
          <Route path="flashcards/*" element={<Flashcards />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:id" element={<BlogDetail />} />
        </Route>

        <Route path="/admin" element={<Admin />}>
          <Route index element={<Dashboard />} />
          <Route path="user-manager" element={<ManagerUser />} />
          <Route path="admin-blog" element={<AdminBlog />} />
          <Route path="admin-blog/addNewBlog" element={<AddNewBlog />} />
          <Route path="admin-blog/addNewBlog/:id" element={<AddNewBlog />} />
          <Route path="flashcards" element={<AdminFlashcard />} />
          <Route path="flashcard/add" element={<AddFlashcard />} />
          <Route path="flashcard/edit/:id" element={<EditFlashcard />} />
          <Route path="examlist" element={<ExamList />} /> {/* ✅ đã sửa */}
        </Route>

        <Route
          path="/login"
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path="/register"
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Layout;
