import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidenav.css";
import PetsIcon from '@mui/icons-material/Pets';
import ForestIcon from '@mui/icons-material/Forest';
import ExploreIcon from "@mui/icons-material/Explore";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AddIcon from '@mui/icons-material/Add';
import { Category } from "../types/interfaces";


const Sidenav: React.FC = () => {
  const navigate = useNavigate();

  // Kategorie z ikonami i ścieżkami
  const [categories] = useState<Category[]>([
    { name: "Animals",color: "#FFB6C1", path: "/main", icon: <PetsIcon /> },
    { name: "Nature", color: "#98FB98", path: "/search", icon: <ForestIcon /> },
    { name: "Car", color: "#ADD8E6", path: "/explore", icon: <DirectionsCarIcon /> },
    { name: "Exploring", color: "#FFDA89", path: "/create", icon: <ExploreIcon /> },
  ]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

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
            {category.icon}
            <span>{category.name}</span>
          </button>
        ))}
      </div>
      <button className="floating-button">
        <AddIcon />
      </button>
    </div>
  );
};

export default Sidenav;
