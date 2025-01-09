import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidenav.css";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MenuIcon from "@mui/icons-material/Menu";

const Sidenav: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="sidenav">
      <h3 className="sidenav_logo">PhotoSphere</h3>

      <div className="sidenav__buttons">
        <button className="sidenav__button" onClick={() => handleNavigation("/main")}>
          <HomeIcon />
          <span>Home</span>
        </button>
        <button className="sidenav__button" onClick={() => handleNavigation("/search")}>
          <SearchIcon />
          <span>Search</span>
        </button>
        <button className="sidenav__button" onClick={() => handleNavigation("/explore")}>
          <ExploreIcon />
          <span>Explore</span>
        </button>
        <button className="sidenav__button" onClick={() => handleNavigation("/create")}>
          <AddCircleOutlineIcon />
          <span>Create</span>
        </button>
      </div>
      <div className="sidenav__more">
        <button className="sidenav__button">
          <MenuIcon />
          <span className="sidenav__buttonText">More</span>
        </button>
      </div>
    </div>
  );
};

export default Sidenav;
