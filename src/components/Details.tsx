import React, { useState, useEffect } from "react";
import { db } from "../services/firebaseConfig";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useLocation } from "react-router-dom";
import "./styles/Details.css";
import Navbar from "./navbar/Navbar";
import Sidenav from "./navigation/Sidenav";

const Details: React.FC = () => {
  const location = useLocation();
  const pin = location.state?.pin;  // Pobieramy pin z przekazanych danych
  const [comments, setComments] = useState<{ username: string; text: string }[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);  // Dodajemy stan dla użytkownika
  const timestampDate = pin?.timestamp ? new Date(pin.timestamp) : new Date(); 

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [pin]);

  const loadComments = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "comments"), where("pinId", "==", pin?.id))
      );
      const fetchedComments: { username: string; text: string }[] = [];
      querySnapshot.forEach((doc) => {
        fetchedComments.push(doc.data() as { username: string; text: string });
      });
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
      alert("Wystąpił błąd podczas ładowania komentarzy.");
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  useEffect(() => {
    // Ładowanie komentarzy po załadowaniu strony
    if (pin?.id) {
      loadComments(); // Wczytaj komentarze, gdy `pin` jest dostępny
    }
  }, [pin?.id]);

  const handleAddComment = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
  
    if (currentUser && newComment.trim()) {
      try {
        await addDoc(collection(db, "comments"), {
          username: currentUser.displayName || "Anonimowy użytkownik",
          text: newComment,
          pinId: pin?.id, 
        });
        setNewComment("");
        loadComments();
      } catch (error) {
        console.error("Error adding comment:", error);
        alert("Wystąpił błąd podczas dodawania komentarza.");
      }
    } else {
      alert("Musisz być zalogowany, aby dodać komentarz");
    }
  };

  if (!pin?.id) {
    return <div>Loading...</div>; // Możesz dodać komunikat, jeśli `pin` nie jest dostępny
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
              <img src={pin.postImage} alt={pin.description || "Opis zdjęcia"} />
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
                    {comments.map((comment, index) => (
                      <li key={index} className="photo__comment">
                        <strong>{comment.username}:</strong> {comment.text}
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
                    onChange={handleCommentChange}
                    placeholder="Comment..."
                  />
                  <button className="button" onClick={handleAddComment}>
                    Send
                  </button>
                </div>
              ) : (
                <div>
                  <p>Musisz być zalogowany, aby dodać komentarz</p>
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
