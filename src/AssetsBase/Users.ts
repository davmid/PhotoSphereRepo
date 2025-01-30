import { User } from '../types/interfaces'

export const exampleUsers: User[] = [
    {
      name: "Jan Kowalski",
      email: "jan.kowalski@example.com",
      id: 1,
      avatarUrl: "https://example.com/avatar1.jpg",
      role: "user",
      createdAt: new Date(),
    },
    {
      name: "Anna Nowak",
      email: "anna.nowak@example.com",
      id: 2,
      avatarUrl: "https://example.com/avatar2.jpg",
      role: "admin",
      createdAt: new Date(),
    },
    {
      name: "Piotr Zieliński",
      email: "piotr.zielinski@example.com",
      id: 3,
      avatarUrl: "https://example.com/avatar3.jpg",
      role: "guest",
      createdAt: new Date(),
    }
  ];