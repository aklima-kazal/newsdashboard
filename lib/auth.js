export const loginUser = (email, password) => {
  if (email && password) {
    localStorage.setItem("auth", "true");
    return true;
  }
  return false;
};

export const logoutUser = () => {
  localStorage.removeItem("auth");
};

export const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("auth") === "true";
};
