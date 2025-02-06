import React, { useState, useEffect } from "react";
import "./styles/CreatePost.css";
import Sidenav from "./navigation/Sidenav";
import Navbar from "./navbar/Navbar";
import { storage, db } from "../services/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import Pin from "./Photoboard/Pin"; // Import Pin component

const CreatePost: React.FC = () => {
  const [formData, setFormData] = useState({
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to upload a post.");
      return;
    }

    if (!file) {
      alert("Please upload an image.");
      return;
    }

    setUploading(true);

    try {
      const storageRef = ref(storage, `posts/${user.uid}/${uuidv4()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      console.log("Uploaded Image URL:", imageUrl);

      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        username: user.displayName || "Anonymous",
        postImage: imageUrl,
        description: formData.description,
        likes: 0,
        timestamp: new Date(),
      });

      console.log("Post Created");

      setFormData({ description: "" });
      setFile(null);

      // ✅ Force refresh the posts list
      window.location.reload();
    } catch (error) {
      console.error("Error adding document:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="createpage">
        <div className="container__navWraper">
          <Sidenav />
        </div>
        <div className="container__create">
          <div className="create-post">
            <h2>Create a New Post</h2>
            <div className="create-post__container">
              <div className="image-preview">
                  <button className="image-placeholder">Image Preview</button>
              </div>

              {user ? (
                <form onSubmit={handleSubmit} className="create-post__form">
                  <div className="form-group">
                    <label htmlFor="fileUpload">Upload Image:</label>
                    <input
                      type="file"
                      id="fileUpload"
                      onChange={handleFileChange}
                      accept="image/*"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Write something about your post"
                      required
                    />
                  </div>
                  <button type="submit" className="create-post__button" disabled={uploading}>
                    <span className="text">{uploading ? "Uploading..." : "Create Post"}</span>
                  </button>
                </form>
              ) : (
                <p>Please log in to create a post.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
