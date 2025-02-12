import React from "react";
import "./styles/Homepage.css";
import Sidenav from "./navigation/Sidenav";
import Navbar from "./navbar/Navbar";
import PinBoard from "./Photoboard/PinBoard";

const Homepage: React.FC = () => {
  return (
    <div className="container_navBar">
      <Navbar />
      <div className="homepage">
        <div className="homepage__navWraper">
          <Sidenav />
        </div>
        <div className="homepage__pinboard">
          {/* <Photoboard /> */}
          {<PinBoard />}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
