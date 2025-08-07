// Importa as funções e hooks do React
import React, { createContext, useState, useEffect } from "react";

// Cria o contexto que será usado em toda a aplicação
export const AuthContext = createContext();

// Cria o provedor do contexto, que vai envolver os componentes da aplicação
export const AuthProvider = ({ children }) => {
  // Estado para saber se o usuário está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Estado para armazenar o token JWT
  const [token, setToken] = useState(null);

  // Estado para armazenar os dados do usuário
  const [user, setUser] = useState(null);

  // useEffect roda uma vez, ao montar o componente
  useEffect(() => {
    // Recupera o token e o usuário do localStorage, se existirem
    const savedToken = localStorage.getItem("token");
    const savedUser = JSON.parse(localStorage.getItem("user"));

    // Se houver token salvo, atualiza os estados
    if (savedToken) {
      setIsAuthenticated(true);
      setToken(savedToken);
      setUser(savedUser);
    }
  }, []);

  // Função de login: salva token e dados do usuário no localStorage e nos estados
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Função de logout: limpa o localStorage e reseta os estados
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Retorna o provedor com os dados e funções disponíveis para os componentes filhos
  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
