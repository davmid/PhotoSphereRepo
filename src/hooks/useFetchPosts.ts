import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy, Query, DocumentData } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

const useFetchPosts = (selectedCategory: string, selectedUser: string) => {
    const [pins, setPins] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                let q: Query<DocumentData>;

                if (selectedCategory !== "All" && selectedUser) {
                    q = query(
                        collection(db, "posts"),
                        where("category", "==", selectedCategory),
                        where("userId", "==", selectedUser),
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
                        where("userId", "==", selectedUser),
                        orderBy("timestamp", "desc")
                    );
                } else {
                    q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
                }

                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    console.warn("No posts found.");
                }

                const postList = querySnapshot.docs.map((doc) => {
                    const data = doc.data();

                    return {
                        id: doc.id,
                        postImage: data.postImage || "https://via.placeholder.com/300",
                        userId: data.userId || "MISSING_USERID", 
                        username: data.username || "Unknown", 
                        description: data.description || "No description",
                        category: data.category || "Uncategorized",
                        likedBy: data.likedBy || [], 
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

    return { pins, loading, setPins, setLoading };
};

export default useFetchPosts;
