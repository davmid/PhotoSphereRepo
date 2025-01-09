import React, { useState } from "react";
import "../styles/CreatePost.css";

const CreatePost: React.FC = () => {
    const [formData, setFormData] = useState({
      user: "",
      postImage: "",
      description: "",
    });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Post Created:", formData);
      // Reset form
      setFormData({ user: "", postImage: "", description: "" });
    };
  
    return (
      <div className="create-post">
        <h2>Create a New Post</h2>
        <div className="create-post__container">
          <div className="image-preview">
            {formData.postImage ? (
              <img
                src={formData.postImage}
                alt="Preview"
                className="image-preview__img"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/300";
                }}
              />
            ) : (
              <div className="image-placeholder">Image Preview</div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="create-post__form">
            <div className="form-group">
              <label htmlFor="user">Username:</label>
              <input
                type="text"
                id="user"
                name="user"
                value={formData.user}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="postImage">Image URL:</label>
              <input
                type="url"
                id="postImage"
                name="postImage"
                value={formData.postImage}
                onChange={handleChange}
                placeholder="Enter image URL"
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
            <button type="submit" className="create-post__button">
              Create Post
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default CreatePost;