"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { loginUser } from "@/lib/auth"; // your API login function

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user & token from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      if (savedUser && savedUser !== "undefined" && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch (err) {
      console.error("Failed to load user from localStorage:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function with toast notifications
  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      try {
        const { user: loggedInUser, token: authToken } = await loginUser(
          email,
          password,
        );

        setUser(loggedInUser);
        setToken(authToken);

        localStorage.setItem("user", JSON.stringify(loggedInUser));
        localStorage.setItem("token", authToken);

        toast.success("Login successful! Redirecting to dashboard...");

        // Redirect after a short delay to show toast
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } catch (error) {
        console.error("Login failed:", error);
        toast.error(error?.message || "Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast("Logged out successfully", { icon: "👋" });
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
      <Toaster position="top-right" />
    </AuthContext.Provider>
  );
}
