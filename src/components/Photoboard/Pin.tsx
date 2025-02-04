import React from 'react';
import '../styles/Pin.css';

interface PinProps {
    pin: {
        postImage: string;
        username: string;
        description: string;
    };
}

const Pin: React.FC<PinProps> = ({ pin }) => {
    console.log("Rendering Pin:", pin); // Debugging

    return (
        <div className="pin">
            <img
                src={pin.postImage || "https://via.placeholder.com/300"}
                alt="Uploaded post"
                className="pin__image"
                onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/300";
                }}
            />
            <div className="pin__info">
                <h3>{pin.username}</h3>
                <p>{pin.description}</p>
            </div>
        </div>
    );
};

export default Pin;
