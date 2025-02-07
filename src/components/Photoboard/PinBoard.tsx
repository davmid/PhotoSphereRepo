import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Pin from './Pin';
import '../styles/PinBoard.css';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { categories } from '../../AssetsBase/Categories';

const PinBoard: React.FC = () => {
    const [pins, setPins] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [searchParams] = useSearchParams();
    
    const selectedUser = searchParams.get("user") || "";

    // useEffect(() => {
    //     console.log(`Searching for posts by username: "${selectedUser}"`);
    // }, [selectedUser]);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                let q;
                
                if (selectedCategory !== "All" && selectedUser) {
                    q = query(
                        collection(db, "posts"),
                        where("category", "==", selectedCategory),
                        where("username", "==", selectedUser),
                        orderBy("timestamp", "desc")
                    );
                } else if (selectedCategory !== "All") {
                    q = query(
                        collection(db, "posts"),
                        where("category", "==", selectedCategory),
                        orderBy("timestamp", "desc")
                    );
                } else if (selectedUser) {
                    q = query(
                        collection(db, "posts"),
                        where("username", "==", selectedUser),
                        orderBy("timestamp", "desc")
                    );
                } else {
                    q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
                }

                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    console.warn("No posts found for category",);
                }

                const postList = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    console.log("📌 Fetched Post Data:", data);

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
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [selectedCategory, selectedUser]);

    return (
        <div>
            <select 
                id="category-select"
                onChange={(e) => {
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
                        <p>No posts found {selectedUser ? `for "${selectedUser}"` : ""}.</p>
                    )}
            </div>
        </div>
    );
};

export default PinBoard;
