"use client";

import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Check for existing session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      // In a real app, you might validate the token with an API here
      setIsLoggedIn(true);
      setUser({ email: localStorage.getItem("user_email") });
    }
    setLoading(false);
  }, []);

  // 2. Login Function
  const login = async (email, password) => {
    try {
      // Replace this mock with your actual fetch call:
      // const response = await fetch("YOUR_API_URL/login", { ... });
      // const data = await response.json();

      if (email && password) {
        // Mocking a successful validation
        const token = "mock_token_123";

        // Save to storage so it survives page refreshes
        localStorage.setItem("token", token);
        localStorage.setItem("user_email", email);

        // Update state
        setUser({ email });
        setIsLoggedIn(true);

        return { success: true };
      }
      return { success: false, error: "Invalid credentials" };
    } catch (error) {
      return { success: false, error: "Something went wrong" };
    }
  };

  // 3. Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
