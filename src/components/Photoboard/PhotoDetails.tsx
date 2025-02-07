import React from "react";
import "./PhotoDetails.css";

interface Comment {
  id: string;
  userId: string;
  user: string;
  text: string;
}

interface PhotoDetailsProps {
  user: string;
  description?: string;
  likes: number;
  timestamp: string;
  comments?: Comment[];
}

const PhotoDetails: React.FC<PhotoDetailsProps> = ({
  user,
  description,
  likes,
  timestamp,
  comments,
}) => {
  return (
    <div className="photo__details">
      <div className="photo__header">
        <p>
          <strong>{user}</strong> • {timestamp} || <strong>{likes}</strong> likes
        </p>
      </div>
      {description && <p className="photo__description">{description}</p>}
      <h3>Comments:</h3>
      <div className="photo__comments">
        {comments && comments.length > 0 ? (
          <ul>
            {comments.map((comment, index) => (
              <li key={index} className="photo__comment">
                <strong>{comment.user}:</strong> {comment.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="photo__no-comments">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default PhotoDetails;
