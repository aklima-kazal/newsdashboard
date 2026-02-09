const jwt = require('jsonwebtoken');
const store = require('../store');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!store.sessions[token]) return res.status(401).json({ error: 'Invalid session' });
    const userId = decoded.sub;
    const user = store.users.find(u => u.id === userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { requireAuth };
