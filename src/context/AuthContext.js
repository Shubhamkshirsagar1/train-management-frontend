import React, { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("token", decoded);

        if (decoded.exp * 1000 > Date.now()) {
          setAuth(true);
          setIsAdmin(decoded.role === "admin");
        } else {
          localStorage.removeItem("token");
          setAuth(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setAuth(false);
        setIsAdmin(false);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ auth, isAdmin, loading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
