const API_BASE = 'http://localhost:5000/api';

export const api = {
  register: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }
    return res.json();
  },
  
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }
    return res.json();
  },
  
  getProfile: async (token) => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to get profile');
    return res.json();
  },
  
  getBooks: async () => {
    const res = await fetch(`${API_BASE}/books`);
    if (!res.ok) throw new Error('Failed to get books');
    return res.json();
  },
  
  getBook: async (id) => {
    const res = await fetch(`${API_BASE}/books/${id}`);
    if (!res.ok) throw new Error('Failed to get book');
    return res.json();
  },
  
  updateProgress: async (token, bookId, lastPage, progress) => {
    const res = await fetch(`${API_BASE}/books/${bookId}/progress`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ lastPage, progress })
    });
    if (!res.ok) throw new Error('Failed to update progress');
    return res.json();
  }
};