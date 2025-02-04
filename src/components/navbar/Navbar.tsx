import React, { useState, useEffect } from "react";
import "./Navbar.css";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import logo from "../../photos/OURLOGO.png";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="navbar">
      <img src={logo} alt="Logo" className="logo" />

      <div className="search-box">
        <input type="text" placeholder="Search" />
        <button>
          <SearchIcon style={{ color: "white" }} />
        </button>
      </div>

      <ul>
        <li>Home</li>
        <li>Account</li>
      </ul>

      <div className="userWellcoming">
        Witaj, {user ? user.displayName || "Anonymous" : "Guest"}
        <div className="user-icon">
          <PersonIcon />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
