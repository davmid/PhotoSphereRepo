import * as React from "react";
import "../styles/Pin.css";
import { PinData } from "../../types/interfaces";
import { Avatar, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import InfoIcon from "@mui/icons-material/Info";

const Pin: React.FC<{ pin: PinData }> = ({ pin }) => {
  const timestampDate =
    typeof pin.timestamp === "string" ? new Date(pin.timestamp) : pin.timestamp;

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={`pin ${pin.size}`}
      onMouseEnter={() => setIsHovered(true)}
    
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Zdjęcie na pełny obszar */}
      <img src={pin.postImage} alt={pin.description || "Pinned image"} className="pin__image" />

      {isHovered && (
        <div className="pin__likes">
            <span>Likes: {pin.likes}</span>
        </div>
      )}
      

      {isHovered && (
        <div className="pin__overlay">
          <div className="pin__author">
            <Avatar className="pin__avatar">{pin.user.charAt(0).toUpperCase()}</Avatar>
            <div className="pin__author-info">
              <span className="pin__author-name">{pin.user}</span>
              <span className="pin__timestamp">{timestampDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}


      {isHovered && (
        <div className="pin__buttons">
          <button  className="pin__button">
            <InfoIcon />
          </button >
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



// import * as React from 'react';
// import '../styles/Pin.css';
// import { PinData } from '../../types/interfaces';

// const Pin: React.FC<{ pin: PinData }> = ({ pin }) => {
//     return (
//         <div className={`pin ${pin.size}`}>
//             <img src={pin.postImage} alt={pin.description || "Pinned image"} className="pin__image" />
//             {pin.description && <p className="pin__description">{pin.description}</p>}
//         </div>
//     );
// };

// export default Pin;