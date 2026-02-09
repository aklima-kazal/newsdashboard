export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function registerUser(email, password, name) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();
    console.log('Backend register response status:', res.status);
    console.log('Backend register response data:', data);
    
    if (res.ok) {
      return { ok: true, verificationToken: data.verificationToken };
    }

    return { ok: false, ...(data || {}), status: res.status };
  } catch (err) {
    console.error('Register fetch error:', err);
    return { ok: false, error: 'Failed to register. Please try again.' };
  }
}

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return { ok: true, token: data.token, user: data.user };
    }

    return { ok: false, ...(data || {}), status: res.status };
  } catch (err) {
    return { ok: false, error: 'Failed to login. Please try again.' };
  }
}

export async function logoutUser() {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
    }
  } catch (err) {
    // ignore errors on logout
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export function isLoggedIn() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
}

export function getAuthHeader() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
