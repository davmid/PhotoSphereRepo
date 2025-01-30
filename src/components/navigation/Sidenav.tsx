import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidenav.css";
import AddIcon from '@mui/icons-material/Add';
import { categories } from '../../AssetsBase/Categories'


const Sidenav: React.FC = () => {
  const navigate = useNavigate();

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
            <category.icon/>
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
