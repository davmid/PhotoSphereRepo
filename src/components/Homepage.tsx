import React from "react";
import "../styles/Homepage.css";
import Sidenav from "../navigation/Sidenav";
import Photoboard from "../Photoboard/Photoboard";
import Navbar from './navbar/Navbar'

const Homepage: React.FC = () => {
  return (
      <div className="container_navBar">
        <Navbar />
        <div className="homepage">
          <div className="homepage__navWraper">
            <Sidenav/>
          </div>
          <div className="homepage__pinboard">
            <Photoboard />
          </div>
        </div>
        </div>
  );
};

export default Homepage;
