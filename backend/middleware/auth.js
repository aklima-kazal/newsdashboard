const jwt = require("jsonwebtoken");
const store = require("../store");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function requireAuth(req, res, next) {
  // Extracts token from browser cookies set by js-cookie
  const token =
    req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if the session exists in our store.js
    if (!store.sessions[token]) {
      return res.status(401).json({ error: "Invalid session" });
    }

    const user = store.users.find((u) => u.id === decoded.sub);
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = { requireAuth };
