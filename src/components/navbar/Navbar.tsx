import React, { useState, useEffect } from "react";
import "./Navbar.css";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import logo from "../../photos/OURLOGO.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from '../../services/firebaseConfig';

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [searchUser, setSearchUser] = useState<string>("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read username filter from URL (for keeping the state in input field)
  useEffect(() => {
    const userParam = searchParams.get("user");
    if (userParam) {
      setSearchUser(userParam);
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (!searchUser.trim()) return; // Prevent empty search

    const queryParams = new URLSearchParams(searchParams);
    queryParams.set("user", searchUser.trim()); // Set search query

    console.log("🔍 Updating search URL:", `?${queryParams.toString()}`);
    navigate(`?${queryParams.toString()}`, { replace: true }); // Update URL without reloading
  };

  // 🔹 Handle "Enter" key press
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
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
        <img src={logo} alt="Logo" className="logo" onClick={() => navigate("/main")} />

        {/* 🔹 Search Box with Enter Key Support */}
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search by username..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            onKeyDown={handleKeyPress} // 🔥 Trigger search on Enter
          />
          <button onClick={handleSearch}>
            <SearchIcon style={{ color: "white" }} />
          </button>
        </div>
      </div>

      {/* 🔹 Keep original Login / Account navigation */}
      {user ? (
        <div className="navbar_right">
          <ul>
            <li onClick={() => auth.signOut()}>Log Out</li>
          </ul>
          <div className="userWellcoming">
            <p onClick={() => navigate("/account")}> Welcome, {user?.displayName || "Guest"} </p>
            <div className="user-icon">
              <PersonIcon />
            </div>
          </div>
        </div>
      ) : (
        <div className="navbar_right">
          <ul>
            <li onClick={() => navigate("/login")}>Log In</li> {/* 🔹 Keep this */}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
