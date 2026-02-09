const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const store = require('../store');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

function isValidPassword(password) {
  return typeof password === 'string' && password.trim().length >= 8;
}

router.post('/register', (req, res) => {
  const { email, password, name } = req.body || {};
  const errors = [];
  if (!email) errors.push('Email is required');
  else if (!isValidEmail(email)) errors.push('Invalid email format');
  if (!password) errors.push('Password is required');
  else if (!isValidPassword(password)) errors.push('Password must be at least 8 characters');
  if (errors.length) return res.status(400).json({ errors });

  const normalizedEmail = email.toLowerCase().trim();
  const existing = store.users.find(u => u.email === normalizedEmail);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const passwordHash = bcrypt.hashSync(password.trim(), 10);
  const verificationToken = uuidv4();
  const user = {
    id: uuidv4(),
    email: normalizedEmail,
    name: name || null,
    passwordHash,
    verified: false,
    verificationToken,
    createdAt: new Date().toISOString()
  };
  store.users.push(user);

  // In a real app you'd send this token via email. For dev we return it in the response.
  res.status(201).json({ ok: true, verificationToken });
});

router.get('/verify', (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Missing token' });
  const user = store.users.find(u => u.verificationToken === token);
  if (!user) return res.status(400).json({ error: 'Invalid token' });
  user.verified = true;
  delete user.verificationToken;
  res.json({ ok: true, message: 'Email verified' });
});

router.post('/login', (req, res) => {
  // Validation middleware-style
  function validateLogin(req, res, next) {
    const { email, password } = req.body || {};
    const errors = [];
    if (!email) errors.push('Email is required');
    else if (!isValidEmail(email)) errors.push('Invalid email format');
    if (!password) errors.push('Password is required');
    if (errors.length) return res.status(400).json({ errors });
    req.normalizedEmail = email.toLowerCase().trim();
    req.plainPassword = password;
    next();
  }

  function authenticateUser(req, res, next) {
    const normalizedEmail = req.normalizedEmail;
    const user = store.users.find(u => u.email === normalizedEmail);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!bcrypt.compareSync(req.plainPassword, user.passwordHash)) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.verified) return res.status(403).json({ error: 'Email not verified' });
    req.user = user;
    next();
  }

  // Run validation + authentication, then issue token
  validateLogin(req, res, () => authenticateUser(req, res, () => {
    const user = req.user;
    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    store.sessions[token] = user.id;
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  }));
});

router.post('/logout', (req, res) => {
  const token = req.body.token || (req.headers.authorization || '').replace('Bearer ', '');
  if (token && store.sessions[token]) delete store.sessions[token];
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.sub;
    // require token to be in sessions map (enables logout)
    if (!store.sessions[token]) return res.status(401).json({ error: 'Invalid session' });
    const user = store.users.find(u => u.id === userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
