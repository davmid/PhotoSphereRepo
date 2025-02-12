import React, { useEffect, useState } from "react";
import { Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface PrivateRouteProps {
  element: JSX.Element;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, path }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Jeśli jest użytkownik, to zalogowany
    });
    return () => unsubscribe(); // Czyszczenie subskrypcji
  }, []);

  if (isAuthenticated === null) {
    return null; // Możesz wyświetlić loader, gdy sprawdzamy stan logowania
  }

  // Zwracamy Route tylko wtedy, gdy użytkownik jest zalogowany
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
