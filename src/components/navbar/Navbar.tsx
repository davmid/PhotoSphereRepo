import React, { useState, useEffect } from "react";
import "./Navbar.css";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import logo from "../../photos/OURLOGO.png";
import { useNavigate } from "react-router-dom";
import { auth } from '../../services/firebaseConfig';

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('Wylogowano pomyślnie');
    } catch (error) {
      console.error('Błąd podczas wylogowywania: ', error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="navbar">
      <div className="navbar_left">
      <img src={logo} alt="Logo" className="logo" onClick={() => handleNavigation("/main")} />

      <div className="search-box">
        <input type="text" placeholder="Search" />
        <button>
          <SearchIcon style={{ color: "white" }} />
        </button>
      </div>
    </div>

      {user ? (
        <div className="navbar_right">
          <ul>
            <li onClick={() => auth.signOut()}>Log Out</li>
          </ul>
        <div className="userWellcoming">
          <p onClick={() => handleNavigation("/account")} > Welcome, {user ? user.displayName || "Anonymous" : "Guest"} </p>
          <div className="user-icon">
          <PersonIcon />
          </div>
        </div>
        </div>
      ) : (
        <div className="navbar_right">
          <ul>
            <li onClick={() => handleNavigation("/login")}>Log In</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
