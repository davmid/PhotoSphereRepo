import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Homepage from "./components/Homepage";
import CreatePost from "./components/CreatePost"
import Account from "./components/Account";

const App: React.FC = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<Homepage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
