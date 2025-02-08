# PhotoSphereRepo

## Opis Projektu
PhotoSphereRepo to aplikacja webowa stworzona w **React (TypeScript)**, której celem jest zarządzanie i udostępnianie zdjęć. Użytkownicy mogą przeglądać, dodawać, edytować i usuwać zdjęcia w systemie. Projekt wykorzystuje **Firebase** do uwierzytelniania użytkowników oraz przechowywania danych.

## Technologie użyte w projekcie
- **React (TypeScript)** – Tworzenie interfejsu użytkownika.
- **CSS** – Stylowanie aplikacji.
- **Firebase** – Uwierzytelnianie oraz backend dla przechowywania postów.
- **React Hooks** – Zarządzanie stanem i logiką aplikacji.

## Struktura katalogów
```
PhotoSphereRepo/
│── public/            # Pliki statyczne
│── src/               # Główny kod aplikacji
│   ├── AssetsBase/    # Dane aplikacji (kategorie, użytkownicy, posty)
│   ├── components/    # Komponenty aplikacji
│   │   ├── Photoboard # Główne elementy tablicy zdjęć
│   │   ├── navbar     # Pasek nawigacyjny
│   │   ├── navigation # Menu boczne
│   ├── hooks/         # Niestandardowe hooki React
│   ├── services/      # Konfiguracja Firebase i zabezpieczenie tras
│   ├── types/         # Definicje typów TypeScript
│── package.json       # Konfiguracja aplikacji
│── tsconfig.json      # Konfiguracja TypeScript
```

## Kluczowe funkcje w kodzie

### 1. **Obsługa Firebase (`firebaseConfig.ts`)**
**Opis**: Plik zawiera konfigurację Firebase do obsługi logowania i przechowywania danych.

```typescript
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
};
const app = initializeApp(firebaseConfig);
```

### 2. **Uwierzytelnianie użytkownika (`firebaseFunctions.ts`)**
**Opis**: Funkcje do logowania, rejestracji oraz wylogowywania użytkownika za pomocą Firebase.

```typescript
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};
```

### 3. **Obsługa postów (`useFetchPosts.ts`)**
**Opis**: Hook do pobierania postów z bazy danych.

```typescript
import { useEffect, useState } from "react";
export const useFetchPosts = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    // Pobieranie danych z Firebase lub API
  }, []);
  return posts;
};
```

### 4. **Tworzenie posta (`CreatePost.tsx`)**
**Opis**: Komponent umożliwia dodawanie nowych zdjęć przez użytkowników.

```typescript
const handleSubmit = async () => {
  const newPost = {
    title,
    imageUrl,
    userId: currentUser.uid,
  };
  await addDoc(collection(db, "posts"), newPost);
};
```

### 5. **Zabezpieczenie tras (`PrivateRoute.tsx`)**
**Opis**: Komponent sprawdzający, czy użytkownik jest zalogowany.

```typescript
const PrivateRoute = ({ children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};
```

## Jak uruchomić projekt?
1. Zainstaluj zależności:
   ```sh
   npm install
   ```
2. Uruchom aplikację:
   ```sh
   npm start
   ```

## Podsumowanie
Aplikacja PhotoSphereRepo to platforma do zarządzania zdjęciami, umożliwiająca użytkownikom interakcję z postami. Wykorzystuje **React + TypeScript** i **Firebase** do autoryzacji i przechowywania danych.
