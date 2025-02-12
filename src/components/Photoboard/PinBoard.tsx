import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Pin from "./Pin";
import "../styles/PinBoard.css";
import useFetchPosts from "../../hooks/useFetchPosts";

const PinBoard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "All";
  const selectedUser = searchParams.get("userId") || "";
  const { pins, loading } = useFetchPosts(selectedCategory, selectedUser);

  return (
    <div>
      <div className="pin_container">
        {loading ? (
          <p>Loading posts...</p>
        ) : pins.length > 0 ? (
          pins.map((pin) => {
            const sizes = ["small", "medium", "large"];
            const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
            return <Pin key={pin.id} pin={pin} randomSize={randomSize} />;
          })
        ) : (
          <p>No posts found {selectedUser ? `for "${selectedUser}"` : ""}.</p>
        )}
      </div>
    </div>
  );
};

export default PinBoard;
