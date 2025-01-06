import React from "react";
import { Avatar } from "@mui/material";
import "./Suggestions.css";

const Suggestions: React.FC = () => {
  const suggestions = [
    { username: "redian_", relation: "New to Instagram" },
    { username: "johndoe", relation: "Followed by your friends" },
    { username: "janedoe", relation: "Recently joined" },
    { username: "coolguy123", relation: "Popular user" },
  ];

  return (
    <div className="suggestions">
      <div className="suggestions__title">Suggestions for you</div>
      <div className="suggestions__usernames">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="suggestions__username">
            <div className="username__left">
              <span className="avatar">
                <Avatar>{suggestion.username.charAt(0).toUpperCase()}</Avatar>
              </span>
              <div className="username__info">
                <span className="username">{suggestion.username}</span>
                <span className="relation">{suggestion.relation}</span>
              </div>
            </div>
            <button className="follow__button">Follow</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
