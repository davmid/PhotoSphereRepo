import React, { useEffect, useState } from 'react';
import Pin from './Pin';
import '../styles/PinBoard.css';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { categories } from '../../AssetsBase/Categories';

const PinBoard: React.FC = () => {
    const [pins, setPins] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                let q;
                if (selectedCategory !== "All") {
                    q = query(
                        collection(db, "posts"),
                        where("category", "==", selectedCategory),
                        orderBy("timestamp", "desc")
                    );
                } else {
                    q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
                }
        
                const querySnapshot = await getDocs(q);
        
                if (querySnapshot.empty) {
                    console.warn(`⚠️ No posts found for category: "${selectedCategory}"`);
                }
        
                const postList = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
        
                    return {
                        id: doc.id,
                        postImage: data.postImage || "https://via.placeholder.com/300",
                        username: data.username || "Unknown",
                        description: data.description || "No description",
                        category: data.category || "Uncategorized",
                        timestamp: data.timestamp?.toDate
                            ? data.timestamp.toDate().toLocaleString()
                            : "Unknown date",
                    };
                });
        
                setPins(postList);
            } catch (error) {
                console.error("❌ Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [selectedCategory]);

    return (
        <div>
            <select 
                id="category-select"
                onChange={(e) => {
                    console.log("Selected Category:", `"${e.target.value}"`);
                    setSelectedCategory(e.target.value.trim()); 
                    setPins([]);
                    setLoading(true);
                }}
                value={selectedCategory}
            >
                <option value="All">All Categories</option>
                {categories.map((cat, index) => (
                    <option key={index} value={cat.name}>
                        {cat.name}
                    </option>
                ))}
            </select>
            <div className="pin_container">
                {loading ? <p>Loading posts...</p> : 
                    pins.length > 0 ? (
                        pins.map((pin) => {
                            const sizes = ["small", "medium", "large"];
                            const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        
                            return <Pin key={pin.id} pin={pin} randomSize={randomSize} />;
                        })
                    ) : (
                        <p>No posts available for this category.</p>
                    )}
            </div>
        </div>
    );
};

export default PinBoard;
