import React, { useState, useEffect } from "react";
import { db } from "../services/firebaseConfig";
import { collection, getDocs, query, where, addDoc, deleteDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useLocation } from "react-router-dom";
import "./styles/Details.css";
import Navbar from "./navbar/Navbar";
import Sidenav from "./navigation/Sidenav";
import { Comment } from "../types/interfaces"; // Ensure this file contains the correct Comment interface

const Details: React.FC = () => {
  const location = useLocation();
  const pin = location.state?.pin; // Pobieramy pin z przekazanych danych
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null); // Dodajemy stan dla użytkownika
  const timestampDate = pin?.timestamp ? new Date(pin.timestamp) : new Date();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const loadComments = async () => {
    if (!pin?.id) return;
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "comments"), where("pinId", "==", pin.id))
      );
      
      const fetchedComments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Comment, "id">),
      }));

      setComments(fetchedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
      alert("An error occurred while loading comments.");
    }
  };

  const handleDeleteComment = async (commentId: string, commentUserId: string) => {
    if (!user || user.uid !== commentUserId) {
      alert("You can only delete your own comments!");
      return;
    }
    try {
      await deleteDoc(doc(db, "comments", commentId));
      loadComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("An error occurred while deleting the comment.");
    }
  };

  useEffect(() => {
    // Ładowanie komentarzy po załadowaniu strony
    loadComments();
  }, [pin?.id]);

  const handleAddComment = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser && newComment.trim()) {
      try {
        await addDoc(collection(db, "comments"), {
          username: currentUser.displayName || "Anonymous User",
          text: newComment,
          pinId: pin?.id,
          userId: currentUser.uid,
        });
        setNewComment("");
        loadComments();
      } catch (error) {
        console.error("Error adding comment:", error);
        alert("An error occurred while adding the comment.");
      }
    } else {
      alert("You must be logged in to add a comment.");
    }
  };

  if (!pin?.id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container_navBar">
      <Navbar />
      <div className="container">
        <div className="homepage__navWrapper">
          <Sidenav />
        </div>
        <div className="detailspage">
          <div className="details">
            <div className="imagedisplay">
              <img src={pin.postImage} alt={pin.description || "Image description"} />
            </div>
            <div className="contentdisplay">
              <div className="button_panel">
                <button className="button">Like {pin.likes}</button>
                <button className="button">Save</button>
              </div>
              <div className="image_description">
                <h4>{pin.description}</h4>
              </div>
              <div className="username_date">
                <h4>{pin.username} - {timestampDate.toLocaleDateString()}</h4>
              </div>
              <h4>Comments:</h4>
              <div className="photo__comments">
                {comments.length > 0 ? (
                  <ul>
                    {comments.map((comment) => (
                      <li key={comment.id} className="photo__comment">
                        <strong>{comment.user}:</strong> {comment.text}
                        {user && user.uid === comment.userId && (
                          <button 
                            className="delete-comment-btn"
                            onClick={() => handleDeleteComment(comment.id, comment.userId)}
                          >
                            🗑 Delete
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="photo__no-comments">No comments yet.</p>
                )}
              </div>
              {user ? (
                <div className="commentbox">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Comment..."
                  />
                  <button className="button" onClick={handleAddComment}>
                    Send
                  </button>
                </div>
              ) : (
                <div>
                  <p>You must be logged in to add a comment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
