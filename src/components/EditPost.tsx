import React, { useState, useEffect } from "react";
import { db } from "../services/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/EditPost.css";
import Navbar from "./navbar/Navbar";
import Sidenav from "./navigation/Sidenav";

const EditPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>(); // Pobieramy `postId` z URL
  const [postDescription, setPostDescription] = useState("");
  const [postImage, setPostImage] = useState(""); // Dodane pole do obrazu posta
  const [user, setUser] = useState<any>(null); // Stan dla użytkownika
  const [postCategory, setPostCategory] = useState(""); 
  const [isLoading, setIsLoading] = useState(true); // Dodano stan ładowania
  const [isUpdated, setIsUpdated] = useState(false); // Stan do sprawdzenia, czy zostały wprowadzone zmiany
  const navigate = useNavigate(); // Nawigacja po zapisaniu zmian

  const categories = ["Animals", "Nature", "Car", "Wallpapers", "Other"];
  // Używamy useEffect do załadowania danych posta na podstawie postId
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        const postRef = doc(db, "posts", postId);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
          const postData = postDoc.data();
          setPostDescription(postData?.description || "");
          setPostImage(postData?.postImage || "");
        } else {
          alert("Post not found!");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("An error occurred while fetching the post.");
      } finally {
        setIsLoading(false); // Po załadowaniu ustawiamy ładowanie na false
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Funkcja do zapisania zmian w opisie posta
  const handleSavePost = async () => {
    if (!user || !postId) {
      alert("You must be logged in and post must exist.");
      return;
    }

    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        description: postDescription,
        postImage: postImage
      });
      navigate(`/main`); // Przekierowanie do strony szczegółów
    } catch (error) {
      console.error("Error updating post:", error);
      alert("An error occurred while saving the post.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Pokazuje "Loading..." jeśli `postId` nie jest dostępne
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
                <img src={postImage} alt={postDescription || "Post image"} />
            </div>
            <div className="contentdisplay">
            <div className="button_panel">
                <h4>Edit Post</h4>
              </div>
              <div className="image_description">
              <h5>Post Description</h5>
                <textarea
                  id="description"
                  value={postDescription}
                  onChange={(e) => {
                    setPostDescription(e.target.value);
                    setIsUpdated(true); // Po zmianie ustawiamy flagę
                  }}
                  placeholder="Edit your post description..."
                />
              </div>
              <div>
              <h5>Post Category</h5>
                <select
                  id="category"
                  value={postCategory}
                  onChange={(e) => {
                    setPostCategory(e.target.value);
                    setIsUpdated(true); // Po zmianie ustawiamy flagę
                  }}
                >
                  <option value="">Select a Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="save_btn">
              <button
                  className="button"
                  onClick={handleSavePost}
                  disabled={!isUpdated || !user} // Przycisk nieaktywny, jeśli nie ma zmian lub użytkownik nie jest zalogowany
                >
                  Save Changes
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default EditPost;
