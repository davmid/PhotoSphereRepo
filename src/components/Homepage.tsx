import React from "react";
import "../styles/Homepage.css";
import Sidenav from "../navigation/Sidenav";
import Photoboard from "../Photoboard/Photoboard";

const Homepage: React.FC = () => {
  return (
    <div className="homepage">
      <div className="homepage__navWraper">
        <Sidenav />
      </div>
      <div className="homepage__timeline">
        <Photoboard />
      </div>
    </div>
  );
};

export default Homepage;
