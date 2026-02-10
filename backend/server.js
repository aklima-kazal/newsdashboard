const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const store = require("./store");

const app = express();
const JWT_SECRET = "dev-secret"; //

app.use(cors({ origin: "http://localhost:3000", credentials: true })); //
app.use(express.json());
app.use(cookieParser());

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = store.users.find(
    (u) => u.email === email && u.password === password,
  );

  if (user) {
    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: "1d" });
    store.sessions[token] = user.id; // CRITICAL: Save session
    return res.json({ success: true, token });
  }
  return res.status(401).json({ error: "Invalid credentials" }); //
});

app.listen(4000, () => console.log("Backend on port 4000"));
