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
import FlashCardDetail from "./components/FlashCards/FlashCardDetail";
import Library from "./pages/library/Library";
const Layout = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/user" element={<User />}></Route>
          <Route index element={<Homepage />}></Route>
          <Route path="/flashcards/*" element={<Flashcards />} />
          <Route path="/flashcards/view/:id" element={<FlashCardDetail />} />{" "}
          {/* <Route path="/flashcards/create" element={<CreateFlashcard />} />{" "} */}
          <Route path='/library' element={<Library />}></Route>
        </Route>
        <Route path="/admin" element={<Admin />}>
          <Route path="user-manager" element={<ManagerUser />}></Route>
          <Route index element={<Dashboard />}></Route>
        </Route>

        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
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
