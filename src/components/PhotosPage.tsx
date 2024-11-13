import React, { useState } from 'react';
import '../styles/PhotosPage.css';

type PostType = {
  src: string;
  comments: string[];
};

const PhotosPage = () => {
  const [comments, setComments] = useState<{ [key: number]: string[] }>({
    0: [],
    1: [],
    2: []
  });

  const addComment = (index: number, comment: string): void => {
    const newComments = {...comments, [index]: [...(comments[index] || []), comment]};
    setComments(newComments);
  };

  // temporary solution!! TODO
  const posts: PostType[] = [
    { 
      src: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60', 
      comments: ['Great photo!', 'Beautiful scenery!']
    },
    { 
      src: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60', 
      comments: ['Amazing!', 'Love this.'] 
    },
    { 
      src: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60', 
      comments: ['So peaceful', 'What a view!'] 
    }
  ];

  return (
    <div className="container">
      <div className="header">
        <button className="button">
          <a href="/Login">Login</a>
        </button>
        <button className="button">
          <a href="/Register">Register</a>
        </button>
        <div className="profile-icon">P</div>
      </div>
      {posts.map((post, index) => (
        <div key={index} className="photo-post">
          <img src={post.src} alt={`Nature Post ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
          <div className="comments-section">
            {post.comments.concat(comments[index] || []).map((comment, idx) => (
              <p key={idx}>{comment}</p>
            ))}
            <input
              type="text"
              placeholder="Add a comment..."
              onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Enter') {
                  const target = event.target as HTMLInputElement;
                  if (target.value) {
                    addComment(index, target.value);
                    target.value = ''; 
                  }
                }
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default PhotosPage;
