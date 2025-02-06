import React, { useEffect, useState } from 'react';
import Pin from './Pin';
import '../styles/PinBoard.css';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';

const PinBoard: React.FC = () => {
    const [pins, setPins] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
                const querySnapshot = await getDocs(q);
                const postList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    postImage: doc.data().postImage || "https://via.placeholder.com/300",
                    username: doc.data().username || "Unknown",
                    description: doc.data().description || "No description"
                }));

                console.log("Fetched Posts:", postList);
                setPins(postList);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="pin_container">
            {loading ? <p>Loading posts...</p> : 
                pins.length > 0 ? (
                    pins.map((pin) => {
                        const sizes = ["small", "medium", "large"];
                        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    
                        return <Pin key={pin.id} pin={pin} randomSize={randomSize} />;
                    })
                ) : (
                    <p>No posts available.</p>
                )}
        </div>
    );
};

export default PinBoard;
