import React, { useState, useEffect } from "react";
import { db } from "../services/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/Details.css";
import Navbar from "./navbar/Navbar";
import Sidenav from "./navigation/Sidenav";
import { Comment } from "../types/interfaces";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Details: React.FC = () => {
  const location = useLocation();
  const [pin, setPin] = useState(location.state?.pin || null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null); // User authentication state
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const navigate = useNavigate();
  const timestampDate = pin?.timestamp ? new Date(pin.timestamp) : new Date();
  const [savedPins, setSavedPins] = useState<string[]>([]);
  const [postUsername, setPostUsername] = useState<string>("Unknown");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchSavedPins = async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setSavedPins(userData?.savedPins || []);
          }
        } catch (error) {
          console.error("Error fetching saved pins:", error);
        }
      };

      fetchSavedPins();
    }
  }, [user]);

  useEffect(() => {
    if (pin?.userId) {
      const fetchUsername = async () => {
        try {
          const userRef = doc(db, "users", pin.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setPostUsername(userSnap.data().username || "Unknown"); // ✅ Set username from Firestore
          } else {
            console.log("User not found for userId:", pin.userId);
          }
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      };
      fetchUsername();
    }
  }, [pin?.userId]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // Tworzymy dokument użytkownika z pustą tablicą savedPins, jeśli jeszcze nie istnieje
          await setDoc(userRef, { savedPins: [] });
        }
      }
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

  const handleLike = async () => {
    if (!user) {
      alert("You must be logged in to like a post.");
      return;
    }
    const postRef = doc(db, "posts", pin.id);
    const postSnapshot = await getDoc(postRef);
    if (postSnapshot.exists()) {
      let likedBy = postSnapshot.data()?.likedBy || [];
      if (likedBy.includes(user.uid)) {
        likedBy = likedBy.filter((uid: string) => uid !== user.uid);
      } else {
        likedBy.push(user.uid);
      }
      await updateDoc(postRef, { likedBy });
      setLikes(likedBy.length);
      setHasLiked(likedBy.includes(user.uid));
    }
  };

  useEffect(() => {
    loadComments();
  }, [pin?.id]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!pin?.id) return;

      try {
        const postRef = doc(db, "posts", pin.id);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const postData = postSnap.data();
          console.log("Fetched Post from Firestore:", postData);
          setPin((prevPin: typeof pin) => ({ ...prevPin, ...postData }));
        } else {
          console.log("Post not found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching post from Firestore:", error);
      }
    };

    if (!pin?.userId) {
      fetchPost();
    }
  }, [pin]);

  const handleDeleteComment = async (
    commentId: string,
    commentUserId: string
  ) => {
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

  const handleDeletePost = async () => {
    if (!user || user.uid !== pin?.userId) {
      alert("You can only delete your own post!");
      return;
    }

    try {
      console.log("Deleting post:", pin);
      const commentsQuery = query(
        collection(db, "comments"),
        where("pinId", "==", pin.id)
      );
      const querySnapshot = await getDocs(commentsQuery);
      await Promise.all(
        querySnapshot.docs.map((commentDoc) =>
          deleteDoc(doc(db, "comments", commentDoc.id))
        )
      );

      // Delete the post itself
      await deleteDoc(doc(db, "posts", pin.id));

      alert("Post deleted successfully!");
      navigate("/main");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post.");
    }
  };

  useEffect(() => {
    const fetchLikes = async () => {
      const postRef = doc(db, "posts", pin.id);
      const postSnapshot = await getDoc(postRef);
      if (postSnapshot.exists()) {
        const postData = postSnapshot.data();
        setLikes(postData?.likedBy?.length || 0);
      }
    };

    fetchLikes();
  }, [pin.id]);

  // Debugging Logs
  useEffect(() => {
    console.log("Logged-in User:", user);
  }, [user]);

  useEffect(() => {
    console.log("Updated Pin Data:", pin);
  }, [pin]);

  if (!pin?.id) {
    return <div>Loading...</div>;
  }
  console.log("Final pin.userId:", pin.userId);

  const handleSavePin = async () => {
    if (!user) {
      alert("You must be logged in to save a post.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid); // Dokument użytkownika
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        let savedPins = userSnap.data()?.savedPins || [];

        // Sprawdzamy, czy pin już jest zapisany
        if (savedPins.includes(pin.id)) {
          savedPins = savedPins.filter(
            (savedPinId: string) => savedPinId !== pin.id
          );
        } else {
          savedPins.push(pin.id);
        }

        // Aktualizujemy zapisane piny w dokumencie użytkownika
        await updateDoc(userRef, { savedPins });

        // Ustawiamy zaktualizowaną tablicę zapisanych pinów w stanie
        setSavedPins(savedPins);

        console.log(savedPins.includes(pin.id) ? "Pin saved!" : "Pin removed!");
      } else {
        console.log("User document not found.");
      }
    } catch (error) {
      console.error("Error saving pin:", error);
      alert("An error occurred while saving the pin.");
    }
  };

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
              <img
                src={pin.postImage}
                alt={pin.description || "Image description"}
              />
            </div>
            <div className="contentdisplay">
              {user && pin?.userId && user.uid === pin.userId && (
                <button
                  className="button delete-post-btn"
                  onClick={handleDeletePost}
                >
                  🗑 Delete Post
                </button>
              )}

              {user && (
                <div className="button_panel">
                  <button className="button" onClick={handleSavePin}>
                    {savedPins.includes(pin.id) ? "Unsave" : "Save"} Pin
                  </button>
                  {hasLiked ? (
                    // Jeśli post jest już polubiony przez użytkownika
                    <button className="like-btn" onClick={handleLike}>
                      <FavoriteIcon />
                    </button>
                  ) : (
                    // Jeśli post nie jest polubiony przez użytkownika
                    <button className="like-btn" onClick={handleLike}>
                      <FavoriteBorderIcon />
                    </button>
                  )}
                  <h3>Likes: {likes}</h3>
                </div>
              )}

              <div className="image_description">
                <h4>{pin.description}</h4>
              </div>
              <div className="username_date">
                <h4>
                  {postUsername} - {timestampDate.toLocaleDateString()}
                </h4>
              </div>

              <h4>Comments:</h4>
              <div className="photo__comments">
                {comments.length > 0 ? (
                  <ul>
                    {comments.map((comment) => (
                      <li key={comment.id} className="photo__comment">
                        <strong>{comment.username}: &nbsp; </strong>{" "}
                        {comment.text}
                        {user && user.uid === comment.userId && (
                          <button
                            className="delete-comment-btn"
                            onClick={() =>
                              handleDeleteComment(comment.id, comment.userId)
                            }
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
