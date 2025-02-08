import React, { useEffect, useState } from 'react';
import '../styles/Pin.css';
import { Avatar } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useNavigate } from 'react-router-dom';
import { db } from "../../services/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface PinProps {
    pin: {
        id: string;
        postImage: string;
        username: string;
        description: string;
        likedBy: [];  // Tablica z UID użytkowników, którzy polubili post
        timestamp: string | Date;
    };
    randomSize: string;
}

const Pin: React.FC<PinProps> = ({ pin, randomSize }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [hasLiked, setHasLiked] = useState<boolean>(false);  // Stan, który sprawdza, czy użytkownik polubił post
    const [currentUser, setCurrentUser] = useState<any>(null);  // Przechowujemy bieżącego użytkownika
    const [likes, setLikes] = useState<number>(pin.likedBy?.length || 0);  // Liczba polubień na podstawie długości likedBy
    const timestampDate = pin.timestamp ? new Date(pin.timestamp) : new Date();

    // Subskrypcja na zmiany stanu użytkownika Firebase
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);  // Ustawiamy aktualnego użytkownika
            } else {
                setCurrentUser(null);  // Brak użytkownika - użytkownik wylogowany
            }
        });

        return () => unsubscribe();  // Czyszczenie subskrypcji
    }, []);

    // Sprawdzamy, czy użytkownik polubił post, jeśli jest zalogowany
    useEffect(() => {
      const fetchLikes = async () => {
          const postRef = doc(db, "posts", pin.id);
          const postSnapshot = await getDoc(postRef);
          if (postSnapshot.exists()) {
              const postData = postSnapshot.data();
              let likedBy = postData?.likedBy || [];  // Zapewniamy, że likedBy jest zawsze tablicą
  
              // Sprawdzamy, czy użytkownik już polubił post
              if (likedBy.includes(currentUser?.uid)) {
                  setHasLiked(true);
              } else {
                  setHasLiked(false);
              }
  
              // Wyświetlanie informacji w konsoli (opcjonalnie)
              console.log(likedBy.length);  // Wyświetlanie liczby polubień
          } else {
              console.log("Post not found");
          }
      };
  
      // Jeśli użytkownik jest dostępny, wykonujemy pobranie danych o "lajkach"
      if (currentUser) {
          fetchLikes();
      }
  }, [currentUser, pin.id]);  // Zależy od currentUser i pin.id, ponieważ pin.likedBy jest częścią pin.id
  
    // Funkcja do pobrania liczby polubień z Firestore
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

    const handleInfoClick = () => {
        navigate(`/details/${pin.id}`, { state: { pin } });
    };

    const handleLike = async (postId: string) => {
        if (!currentUser) {
            console.log("You must be logged in to like a post.");
            return;
        }
        console.log(pin.likedBy);

        try {
            const postRef = doc(db, "posts", postId);  // Odwołanie do dokumentu posta
            const postSnapshot = await getDoc(postRef);

            if (postSnapshot.exists()) {
                const postData = postSnapshot.data();
                let likedBy = postData?.likedBy || [];  // Zapewniamy, że likedBy jest zawsze tablicą

                // Jeśli użytkownik już polubił post, usuwamy jego polubienie
                if (likedBy.includes(currentUser.uid)) {
                    likedBy = likedBy.filter((uid: string) => uid !== currentUser.uid);  // Usuwamy użytkownika z tablicy likedBy
                    await updateDoc(postRef, {
                        likedBy: likedBy,
                    });
                    setHasLiked(false);  // Ustawiamy hasLiked na false po usunięciu "lajka"
                    setLikes(likedBy.length);  // Zaktualizowanie liczby polubień na podstawie liczby elementów w likedBy
                    console.log("Post unliked");
                } else {
                    // Jeśli użytkownik jeszcze nie polubił, dodajemy jego UID do likedBy
                    likedBy.push(currentUser.uid);

                    await updateDoc(postRef, {
                        likedBy: likedBy,  // Zaktualizowanie listy polubionych użytkowników
                    });

                    setHasLiked(true);  // Ustawiamy hasLiked na true po polubieniu
                    setLikes(likedBy.length);  // Zaktualizowanie liczby polubień na podstawie liczby elementów w likedBy
                    console.log("Post liked");
                }
            } else {
                console.log("Post not found");
            }
        } catch (error) {
            console.error("Error liking/unliking post:", error);
        }
    };

    const handleLikeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        handleLike(pin.id);
    };

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
                    {/* Liczba polubień jest teraz oparta na długości tablicy likedBy */}
                    <span>Likes: {likes}</span>
                </div>
            )}

            {isHovered && (
                <div className="pin__overlay">
                    <div className="pin__author">
                        <Avatar className="pin__avatar">{pin.username.charAt(0).toUpperCase()}</Avatar>
                        <div className="pin__author-info">
                            <span className="pin__author-name">{pin.username}</span>
                            <span className="pin__timestamp"> {new Intl.DateTimeFormat("pl-PL", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                            }).format(timestampDate)}
                            </span>

                        </div>
                    </div>
                </div>
            )}

            {isHovered && currentUser && (
                <div className="pin__buttons">
                    <button className="pin__button">
                        <BookmarkBorderIcon />
                    </button>
                    {hasLiked ? (
                        // Jeśli post jest już polubiony przez użytkownika
                        <button className="pin__button" onClick={handleLikeClick}>
                            <FavoriteIcon />
                        </button>
                    ) : (
                        // Jeśli post nie jest polubiony przez użytkownika
                        <button className="pin__button" onClick={handleLikeClick}>
                            <FavoriteBorderIcon />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Pin;
