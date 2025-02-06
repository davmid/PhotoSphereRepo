import React, { useState, useEffect } from "react";
import { db } from "../services/firebaseConfig";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import getAuth
import { useLocation } from "react-router-dom";
import "./styles/Details.css";
import Navbar from "./navbar/Navbar";
import Sidenav from "./navigation/Sidenav";

const Details: React.FC = () => {
  const location = useLocation();
  const pin = location.state?.pin; // Pobieramy pin z przekazanych danych
  const [comments, setComments] = useState<{ username: string; text: string }[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null); // Dodajemy stan dla użytkownika

  useEffect(() => {
    // Sprawdzamy, który użytkownik jest zalogowany
    const auth = getAuth();
    const currentUser = auth.currentUser;
    setUser(currentUser); // Ustawiamy zalogowanego użytkownika

    if (pin) {
      loadComments(); // Wczytanie komentarzy tylko jeśli pin jest dostępny
    }
  }, [pin]);

  const loadComments = async () => {
    const querySnapshot = await getDocs(
      query(collection(db, "comments"), where("pinId", "==", pin?.id))
    );

    const fetchedComments: { username: string; text: string }[] = [];
    querySnapshot.forEach((doc) => {
      fetchedComments.push(doc.data() as { username: string; text: string });
    });
    setComments(fetchedComments); // Ustawienie komentarzy w stanie
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser && newComment.trim()) {
      // Dodanie komentarza z przypisanym pinId
      await addDoc(collection(db, "comments"), {
        username: currentUser.displayName || "Anonimowy użytkownik",
        text: newComment,
        pinId: pin?.id, // Przypisanie id zdjęcia
      });

      setNewComment(""); // Resetowanie tekstu po dodaniu komentarza
      loadComments(); // Ponowne załadowanie komentarzy po dodaniu
    } else {
      alert("Musisz być zalogowany, aby dodać komentarz");
    }
  };

  if (!pin) {
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
              <img src={pin.postImage} alt={pin.description || "Opis zdjęcia"} />
            </div>
            <div className="contentdisplay">
              <div className="button_panel">
                <button className="button">Like {pin.likes}</button>
                <button className="button">Save</button>
              </div>
              <div className="image_description">
                <h3>{pin.description}</h3>
              </div>
              <div className="username_date">
                <h4>{pin.username} - {new Date(pin.timestamp).toLocaleDateString()}</h4>
              </div>
              <h3>Comments:</h3>
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
                    placeholder="Dodaj komentarz..."
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
