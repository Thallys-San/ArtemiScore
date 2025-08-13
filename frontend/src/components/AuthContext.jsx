// AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { onIdTokenChanged, signOut } from "firebase/auth";
import { auth } from "./firebase"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // evita renderização antes de saber se há login

  useEffect(() => {
    // Recupera do localStorage se já havia login salvo
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        setIsAuthenticated(true);
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        // Se der erro no parse, limpa
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    // Listener para atualização automática do token
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const newToken = await firebaseUser.getIdToken(true); // força refresh do token
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };

        setToken(newToken);
        setUser(userData);
        setIsAuthenticated(true);

        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        // Se deslogar no Firebase, limpa tudo
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
