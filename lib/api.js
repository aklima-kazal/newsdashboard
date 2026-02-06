const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const api = {
  async request(endpoint, options = {}) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const headers = { 'Content-Type': 'application/json', ...options.headers };
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) headers.Authorization = `Bearer ${token}`;
      
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('auth');
          }
          throw new ApiError('Your session has expired. Please login again.', 401);
        }
        if (response.status === 400) {
          throw new ApiError(data.error || 'Invalid input. Please check your entries.', 400);
        }
        if (response.status === 404) {
          throw new ApiError('The item you\'re looking for was not found.', 404);
        }
        if (response.status >= 500) {
          throw new ApiError('Server error. Please try again later.', response.status);
        }
        throw new ApiError(data.error || 'Something went wrong. Please try again.', response.status);
      }
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof TypeError) {
        throw new ApiError('Unable to connect to the server. Please check your connection.', 0);
      }
      throw new ApiError(error.message || 'An unexpected error occurred.', 0);
    }
  },

  // Auth
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('auth', 'true');
    }
    return data;
  },

  async logout() {
    const token = localStorage.getItem('token');
    await this.request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
    localStorage.removeItem('token');
    localStorage.removeItem('auth');
  },

  async getCurrentUser() {
    return this.request('/auth/me');
  },

  // News
  async getNews() {
    return this.request('/news');
  },

  async getNewsById(id) {
    return this.request(`/news/${id}`);
  },

  async createNews(title, content, category, status = 'published') {
    return this.request('/news', {
      method: 'POST',
      body: JSON.stringify({ title, content, category, status }),
    });
  },

  async updateNews(id, data) {
    return this.request(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteNews(id) {
    return this.request(`/news/${id}`, { method: 'DELETE' });
  },

  async incrementNewsView(id) {
    return this.request(`/news/${id}/view`, { method: 'POST' });
  },

  // Categories
  async getCategories() {
    return this.request('/categories');
  },

  async createCategory(name) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  async deleteCategory(id) {
    return this.request(`/categories/${id}`, { method: 'DELETE' });
  },
};
