import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Homepage from "./components/Homepage";
import CreatePost from "./components/CreatePost";
import Account from "./components/Account";
import Details from "./components/Details";
import EditPost from "./components/EditPost"
import PrivateRoute from "./services/PrivateRoute"; // Importujemy PrivateRoute

const App: React.FC = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          {/* Publiczne trasy */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<Homepage />} />
          <Route path="/details/:id" element ={<Details />} />

          {/* Trasy prywatne */}
          <Route path="/create" element={<PrivateRoute element={<CreatePost />} path="/create" />} />
          <Route path="/account" element={<PrivateRoute element={<Account />} path="/account" />} />
          <Route path="/edit/:postId" element={<PrivateRoute element={<EditPost />} path="/edit/:id" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
