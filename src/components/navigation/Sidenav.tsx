import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./Sidenav.css";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { categories } from '../../AssetsBase/Categories'
import { db } from '../../services/firebaseConfig'; // Importujemy db z Firebase
import { doc, getDoc } from "firebase/firestore"; // Używamy getDoc do pobierania dokumentu
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Sidenav: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Pobieramy `id` obrazu z URL
  const [user, setUser] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false); // Stan do przechowywania, czy użytkownik jest właścicielem
  const [searchParams] = useSearchParams();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    // Sprawdzamy, czy użytkownik jest zalogowany
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser); // Ustawiamy zalogowanego użytkownika
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Sprawdzamy, czy użytkownik jest właścicielem obrazu po załadowaniu obrazu
    if (id && user) {
      const checkOwner = async () => {
        const docRef = doc(db, "posts", id); // Pobieramy dokument obrazu na podstawie id
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const post = docSnap.data();
          if (post.userId === user.uid) { // Sprawdzamy, czy zalogowany użytkownik jest właścicielem
            setIsOwner(true);
          } else {
            setIsOwner(false);
          }
        }
      };
      checkOwner();
    }
  }, [id, user]); // Uruchamiamy, gdy id lub user się zmienia


  const handleCategoryClick = (category: string) => {
    const queryParams = new URLSearchParams(searchParams);
    if (category === "All") {
        queryParams.delete("category");
    } else {
        queryParams.set("category", category);
    }
    navigate(`?${queryParams.toString()}`, { replace: true });
  };

  return (
    <div className="sidenav">
      <h3 className="sidenav_category">Categories</h3>
      <div className="sidenav__buttons">
        {categories.map((category, index) => (
          <button
            key={index}
            className="sidenav__button"
            onClick={() => handleCategoryClick(category.name)}
            style={{ backgroundColor: category.color }}
          >
            <category.icon />
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Przycisk dodawania */}
      {user ? (
        <button className="floating-button-add" onClick={() => handleNavigation("/create")}>
          <AddIcon />
        </button>
      ) : (
        <div></div>
      )}

      {/* Przycisk edycji, tylko jeśli użytkownik jest właścicielem obrazu */}
      {user && isOwner ? (
        <button className="floating-button-edit" onClick={() => handleNavigation(`/edit/${id}`)}>
          <EditIcon />
        </button>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Sidenav;
