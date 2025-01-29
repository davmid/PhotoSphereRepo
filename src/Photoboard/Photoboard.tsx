import React, { useState, useEffect } from "react";
import Post from "../components/Post/Post";
import Suggestions from "./Suggestions";
import PhotoDetails from "../components/Post/PhotoDetails";
import "../styles/Photoboard.css";

interface Comment {
  user: string;
  text: string;
}

interface PostData {
  user: string;
  postImage: string;
  likes: number;
  timestamp: string;
  description?: string;
  comments?: Comment[]; 
}

const Photoboard: React.FC = () => {
  const [posts] = useState<PostData[]>([
    {
      user: "redian_",
      postImage:
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
      likes: 54,
      timestamp: "2d",
      description: "A beautiful tree in the sunset.",
      comments: [
        { user: "naturelover", text: "Wow, amazing view!" },
        { user: "johndoe", text: "This is breathtaking." },
        { user: "naturelover", text: "Wow, amazing view!" },
        { user: "johndoe", text: "This is breathtaking." },
        { user: "naturelover", text: "Wow, amazing view!" },
        { user: "johndoe", text: "This is breathtaking." },
        { user: "naturelover", text: "Wow, amazing view!" },
        { user: "johndoe", text: "This is breathtaking." },
        { user: "naturelover", text: "Wow, amazing view!" },
        { user: "johndoe", text: "This is breathtaking." },
        { user: "naturelover", text: "Wow, amazing view!" },
        { user: "johndoe", text: "This is breathtaking." },
        { user: "naturelover", text: "Wow, amazing view!" },
        { user: "johndoe", text: "This is breathtaking." },
      ],
    },
    {
      user: "johndoe",
      postImage:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80",
      likes: 432,
      timestamp: "2d",
      description: "Nature at its best.",
      comments: [
        { user: "naturelover", text: "Wow, amazing view!" },
        { user: "johndoe", text: "This is breathtaking." },
      ],
    },
    {
      user: "mariussss",
      postImage:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png",
      likes: 140,
      timestamp: "2d",
      description: "Captured on my phone.",
      comments: [
        { user: "naturelover", text: "Wow, amazing view!" },
        { user: "johndoe", text: "This is breathtaking." },
      ],
    },
    {
      user: "kobee_18",
      postImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGCAaQ5u1TMTij5ELPWi5-VPtlSqELw-R6lj0EpYmNcGt56kOQaCokzS0IK81MOSphlkw&usqp=CAU",
      likes: 14,
      timestamp: "2d",
      description: "Basketball vibes!",
      comments: [
        { user: "naturelover", text: "Wow, amazing view!" },
        { user: "johndoe", text: "This is breathtaking." },
      ],
    },
    {
      user: "Dawid",
      postImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGCAaQ5u1TMTij5ELPWi5-VPtlSqELw-R6lj0EpYmNcGt56kOQaCokzS0IK81MOSphlkw&usqp=CAU",
      likes: 14,
      timestamp: "2d",
      description: "Enjoying the view.",
      comments: [
        { user: "naturelover", text: "Wow, amazing view!" },
        { user: "johndoe", text: "This is breathtaking." },
      ],
    },
  ]);

  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);

  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedPost]);

  const handlePostClick = (post: PostData) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  return (
    <div className="photoboard">
      <div className="photoboard__left">
        <div className="photoboard__posts">
          {posts.map((post, index) => (
            <Post
              key={index}
              user={post.user}
              postImage={post.postImage}
              likes={post.likes}
              timestamp={post.timestamp}
              onImageClick={() => handlePostClick(post)}
            />
          ))}
        </div>
      </div>
      <div className="photoboard__right">
      </div>
      {selectedPost && (
  <div className="modal">
    <div className="modal__overlay" onClick={closeModal}></div>
    <div className="modal__content">
      <button className="modal__close" onClick={closeModal}>
        &times;
      </button>
      <div className="modal__image-wrapper">
        <img
          className="modal__image"
          src={selectedPost.postImage}
          alt="Post"
        />
      </div>
      <div className="modal__details-wrapper">
        <PhotoDetails
          user={selectedPost.user}
          description={selectedPost.description}
          likes={selectedPost.likes}
          timestamp={selectedPost.timestamp}
          comments={selectedPost.comments}
        />
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Photoboard;
