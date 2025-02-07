import React from 'react';
import '../styles/Pin.css';
import { Avatar, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from 'react-router-dom';

interface PinProps {
    pin: {
        id: number;
        postImage: string;
        username: string;
        description: string;
        likes: number;
        timestamp: string | Date;
    };
    randomSize: string;
}


const Pin: React.FC<PinProps> = ({ pin, randomSize}) => {
    console.log("Rendering Pin:", pin);
    const navigate = useNavigate();

    const handleInfoClick = () => {
      navigate(`/details/${pin.id}`, { state: { pin } });
    };

    const [isHovered, setIsHovered] = React.useState(false);
    const timestampDate = pin.timestamp ? new Date(pin.timestamp) : new Date(); 

    return (
        <div
        className={`pin ${randomSize}`}
        onMouseEnter={() => setIsHovered(true)}
  
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Zdjęcie na pełny obszar */}
        <img src={pin.postImage} alt={pin.description || "Pinned image"} className="pin__image" onClick={handleInfoClick} />
  
        {isHovered && (
          <div className="pin__likes">
              <span>Likes: {pin.likes}</span>
          </div>
        )}
  
  
        {isHovered && (
          <div className="pin__overlay">
            <div className="pin__author">
              <Avatar className="pin__avatar">{pin.username.charAt(0).toUpperCase()}</Avatar>
              <div className="pin__author-info">
                <span className="pin__author-name">{pin.username}</span>
                <span className="pin__timestamp">{timestampDate.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
  
  
        {isHovered && (
          <div className="pin__buttons">
            <button  className="pin__button">
              <BookmarkBorderIcon />
            </button >
            <button  className="pin__button">
              <FavoriteBorderIcon />
            </button >
          </div>
  
        )}
      </div>
    );
  };
  
  export default Pin;
