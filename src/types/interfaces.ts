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
    icon: JSX.Element;
  }

  export {};