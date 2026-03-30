const API_BASE = 'http://localhost:8000';

const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || `Error: ${response.status}`);
  }
  
  return response.json().catch(() => ({}));
};

export const userAPI = {
  register: (email, username, password) =>
    apiCall('/users/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    }),

  login: (email, password) =>
    apiCall('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  confirmEmail: (token) =>
    apiCall('/users/confirm-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  getProfile: () =>
    apiCall('/users/profile'),

  logout: () =>
    apiCall('/users/logout', { method: 'POST' }),

  deleteAccount: () =>
    apiCall('/users/delete', { method: 'DELETE' }),

  refreshToken: () =>
    apiCall('/users/refresh', { method: 'POST' }),
};

export default apiCall;
