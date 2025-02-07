import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Pin from './Pin';
import '../styles/PinBoard.css';
import { categories } from '../../AssetsBase/Categories';
import useFetchPosts from '../../hooks/useFetchPosts';

const PinBoard: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const selectedCategory = searchParams.get("category") || "All";
    const selectedUser = searchParams.get("user") || "";
    
    const { pins, loading } = useFetchPosts(selectedCategory, selectedUser);

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
        <div>
            <div className="category-buttons">
                <button 
                    onClick={() => handleCategoryClick("All")}
                    className={selectedCategory === "All" ? "active" : ""}
                >
                    All
                </button>
                {categories.map((cat, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleCategoryClick(cat.name)}
                        className={selectedCategory === cat.name ? "active" : ""}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="pin_container">
                {loading ? <p>Loading posts...</p> : 
                    pins.length > 0 ? (
                        pins.map((pin) => {
                            const sizes = ["small", "medium", "large"];
                            const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
                            return <Pin key={pin.id} pin={pin} randomSize={randomSize} />;
                        })
                    ) : (
                        <p>No posts found {selectedUser ? `for "${selectedUser}"` : ""}.</p>
                    )}
            </div>
        </div>
    );
};

export default PinBoard;
