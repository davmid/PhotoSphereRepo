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

  useEffect(() => {
    const userParam = searchParams.get("user");
    if (userParam) {
      setSearchUser(userParam);
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (!searchUser.trim()) return;

    const queryParams = new URLSearchParams(searchParams);
    queryParams.set("user", searchUser.trim()); 

    navigate(`?${queryParams.toString()}`, { replace: true }); // Update URL without reloading
  };

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

        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search by username..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            onKeyDown={handleKeyPress} 
          />
          <button onClick={handleSearch}>
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
            <p onClick={() => navigate("/account")}> Welcome, {user?.displayName || "Guest"} </p>
            <div className="user-icon">
              <PersonIcon />
            </div>
          </div>
        </div>
      ) : (
        <div className="navbar_right">
          <ul>
            <li onClick={() => navigate("/login")}>Log In</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
