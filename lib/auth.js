import { api } from './api';

export const loginUser = async (email, password) => {
  try {
    const result = await api.login(email, password);
    return !!result.token;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

export const logoutUser = async () => {
  try {
    await api.logout();
  } catch (error) {
    console.error('Logout error:', error);
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
  }
};

export const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("auth") === "true";
};
