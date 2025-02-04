import React, { useState, useEffect } from "react";
import "./styles/Account.css";
import Sidenav from "./navigation/Sidenav";
import Navbar from './navbar/Navbar';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Button } from "@mui/material";
import { Avatar } from "@mui/material";
import { exampleUsers } from "../AssetsBase/Users";
import { useNavigate } from "react-router-dom";

const Account: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  
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

 
  const currentUser = user || exampleUsers[0]; 

  if (!currentUser) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <Navbar />
      <div className="accountpage">
        <div className="navWraper">
          <Sidenav />
        </div>
        <div className="account_container">
          <div className="profile-page">
            <div className="profile-header">
              <div className="profile-image">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={`${currentUser.displayName}'s profile`}
                    className="profile-image__img"
                  />
                ) : (
                  <Avatar className="pin__avatar">
                    {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                )}
              </div>
              <div className="profile-info">
                <h1>{currentUser.displayName || "Anonymous"}</h1>
                <p>@{currentUser.email || "No email"}</p>
                <div className="profile-buttons">
                <button type="submit" className="button_profil" >Edit profile</button>
                </div>
              </div>
            </div>
            <div className="profile-tabs">
              <Button variant="text">Created</Button>
              <Button variant="text">Saved</Button>
            </div>
            <div className="profile-content">
              <p>You don't have any saved Pins yet</p>
              <Button variant="outlined" onClick={() => handleNavigation("/main")}  >Find Pins</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
