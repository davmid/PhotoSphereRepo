import React, { useState, useEffect } from "react";
import "./styles/Account.css";
import Sidenav from "./navigation/Sidenav";
import Navbar from "./navbar/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Button } from "@mui/material";
import { Avatar } from "@mui/material";
import { exampleUsers } from "../AssetsBase/Users";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

const Account: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"created" | "saved">("created");
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && activeTab === "created") {
      fetchUserPosts();
    }
  }, [user, activeTab]);

  const fetchUserPosts = async () => {
    if (!user?.uid) return;
    setLoading(true);

    try {
      console.log("Fetching posts for UID:", user.uid);

      const postsRef = collection(db, "posts");
      const q = query(
        postsRef,
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No posts found for this user.");
      }

      const posts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          postImage: data.postImage || "https://via.placeholder.com/300",
          username: data.username || "Unknown",
          description: data.description || "",
          timestamp: data.timestamp?.toDate
            ? data.timestamp.toDate().toLocaleString()
            : "Unknown date",
        };
      });

      console.log("Final User Posts Array:", posts);
      setUserPosts(posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleInfoClick = (pin: any) => {
    navigate(`/details/${pin.id}`, { state: { pin } });
  };

  

  const currentUser = user || exampleUsers[0];

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="accountpage">
        <div className="navWraper">
          <Sidenav />
        </div>
        <div className="account_container">
          <div className="profile-page">
            <div className="profile-header">
              <div className="profile-image">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={`${currentUser.displayName}'s profile`}
                    className="profile-image__img"
                  />
                ) : (
                  <Avatar className="pin__avatar">
                    {currentUser.displayName
                      ? currentUser.displayName.charAt(0).toUpperCase()
                      : "U"}
                  </Avatar>
                )}
              </div>
              <div className="profile-info">
                <h1>{currentUser.displayName || "Anonymous"}</h1>
                <p>@{currentUser.email || "No email"}</p>
                <div className="profile-buttons">
                  <button type="submit" className="button_profil">
                    Edit profile
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="profile-tabs">
              <Button
                variant={activeTab === "created" ? "contained" : "text"}
                onClick={() => setActiveTab("created")}
              >
                Created
              </Button>
              <Button
                variant={activeTab === "saved" ? "contained" : "text"}
                onClick={() => setActiveTab("saved")}
              >
                Saved
              </Button>
            </div>

            {activeTab === "created" && (
              <div className="profile-content">
                {loading ? (
                  <p>Loading posts...</p>
                ) : userPosts.length > 0 ? (
                  <div className="image-grid">
                    {userPosts.map((post) => (
                      <div
                        key={post.id}
                        className="post-card"
                        onClick={() => handleInfoClick(post)} // Przechodzi do szczegółów po kliknięciu
                      >
                        <img
                          src={post.postImage}
                          alt="User Upload"
                          className="uploaded-image"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>You haven't uploaded any posts yet.</p>
                )}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="profile-content">
                <p>You don't have any saved Pins yet</p>
                <Button variant="outlined" onClick={() => handleNavigation("/main")}>
                  Find Pins
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
