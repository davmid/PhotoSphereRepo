import React from "react";

export interface User {
    name: string;
    email: string;
    id: number;
    avatarUrl?: string;
    role?: "admin" | "user" | "guest";
    createdAt?: Date;
  }
  
  export interface Category {
    name: string;
    color: string;
    path: string;
    icon: React.ElementType;
  }

  export interface Comment {
    id: string;
    userId: string;
    username: string;
    text: string;
  }
  
  export interface PinData {
    user: string;
    postImage: string;
    size: string;
    likes: number;
    timestamp: string | Date;
    description?: string;
    comments?: Comment[]; 
  }