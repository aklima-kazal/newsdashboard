// store.js
const { v4: uuidv4 } = require("uuid");

module.exports = {
  users: [], // { id, email, passwordHash }
  sessions: {}, // { sessionId: userId }
  news: [
    {
      id: "1",
      title: "Welcome to News Dashboard",
      content: "This is the initial news item stored in the in-memory backend.",
      category: "c1",
      status: "published",
      views: 0,
      viewsHistory: [],
      createdAt: new Date().toISOString(),
    },
  ],
  categories: [{ id: "c1", name: "General" }],

  // Helper functions
  addUser(email, passwordHash) {
    const user = { id: uuidv4(), email, passwordHash };
    this.users.push(user);
    return user;
  },

  getUserByEmail(email) {
    return this.users.find((u) => u.email === email);
  },

  getUserById(id) {
    return this.users.find((u) => u.id === id);
  },

  createSession(userId) {
    const sessionId = uuidv4();
    this.sessions[sessionId] = userId;
    return sessionId;
  },

  getUserBySession(sessionId) {
    const userId = this.sessions[sessionId];
    if (!userId) return null;
    return this.getUserById(userId);
  },

  deleteSession(sessionId) {
    delete this.sessions[sessionId];
  },

  addNews({ title, content, category, status }) {
    const newsItem = {
      id: uuidv4(),
      title,
      content,
      category,
      status,
      views: 0,
      viewsHistory: [],
      createdAt: new Date().toISOString(),
    };
    this.news.push(newsItem);
    return newsItem;
  },

  updateNews(id, updates) {
    const newsItem = this.news.find((n) => n.id === id);
    if (!newsItem) return null;
    Object.assign(newsItem, updates);
    return newsItem;
  },

  deleteNews(id) {
    const index = this.news.findIndex((n) => n.id === id);
    if (index === -1) return false;
    this.news.splice(index, 1);
    return true;
  },

  incrementNewsViews(id) {
    const newsItem = this.news.find((n) => n.id === id);
    if (!newsItem) return;
    newsItem.views += 1;
    newsItem.viewsHistory.push({ date: new Date().toISOString() });
  },
};
