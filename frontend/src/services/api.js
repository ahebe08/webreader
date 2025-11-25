const API_BASE = 'http://localhost:5000/api';

const handleResponse = async (response) => {
  // Vérifier d'abord le statut HTTP
  if (!response.ok) {
    // Pour les erreurs 401, ne pas essayer de parser JSON
    if (response.status === 401) {
      throw new Error('Non autorisé - veuillez vous reconnecter');
    }
    
    // Essayer de parser l'erreur JSON, sinon utiliser le texte brut
    try {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
    } catch {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }
  }
  
  // Parser la réponse JSON seulement si le statut est OK
  try {
    return await response.json();
  } catch (error) {
    throw new Error('Réponse JSON invalide du serveur');
  }
};

export const api = {
  register: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password,
        confirmPassword: password 
      })
    });
    return handleResponse(response);
  },
  
  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },
  
  getProfile: async (token) => {
    // Si pas de token, ne pas faire la requête
    if (!token) {
      throw new Error('Token manquant');
    }
    
    const response = await fetch(`${API_BASE}/auth/profile`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  },
  
  getBooks: async (page = 1, limit = 50, search = '', genre = '') => {
    const params = new URLSearchParams({ page, limit, search, genre });
    const response = await fetch(`${API_BASE}/books?${params}`);
    return handleResponse(response);
  },
  
  getBook: async (id) => {
    const response = await fetch(`${API_BASE}/books/${id}`);
    return handleResponse(response);
  },
  
  updateProgress: async (token, bookId, lastPage, progress) => {
    if (!token) {
      throw new Error('Token manquant pour mettre à jour la progression');
    }
    
    const response = await fetch(`${API_BASE}/books/${bookId}/progress`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ lastPage, progress })
    });
    return handleResponse(response);
  }
};