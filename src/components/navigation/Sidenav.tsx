import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidenav.css";
import AddIcon from '@mui/icons-material/Add';
import { categories } from '../../AssetsBase/Categories'
import { auth } from '../../services/firebaseConfig';
import { getAuth, onAuthStateChanged } from "firebase/auth";


const Sidenav: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

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
    <div className="sidenav">
      <h3 className="sidenav_category">Categories</h3>
      <div className="sidenav__buttons">
        {categories.map((category, index) => (
          <button
            key={index}
            className="sidenav__button"
            onClick={() => handleNavigation(category.path)}
            style={{backgroundColor: category.color}}
          >
            <category.icon/>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
      {user ? (
        <button className="floating-button" onClick={() => handleNavigation("/create")}>
          <AddIcon />
        </button>
      ):(
        <div></div>
      )};
    </div>
  );
};

export default Sidenav;
