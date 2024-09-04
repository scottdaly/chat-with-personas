import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const API_BASE_URL = "https://venturementor.co/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/status`, {
        withCredentials: true,
      });
      setIsLoggedIn(response.data.isLoggedIn);
      setUser(response.data.user);
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const handleLogin = () => {
    window.location.href = `${API_BASE_URL}/login`;
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
