
// API configuration for connecting to backend
const API_BASE_URL = '/api';

export const apiClient = {
  baseURL: API_BASE_URL,
  
  // Helper methods for API calls
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
  
  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
  
  patch: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }
};

// Auth API calls
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    apiClient.post('/auth/login', credentials),
  
  signup: (userData: any) => 
    apiClient.post('/auth/signup', userData),
  
  me: () => 
    apiClient.get('/auth/me'),
  
  forgotPassword: (email: string) => 
    apiClient.post('/auth/forgot', { email }),
};

// Lots API calls
export const lotsAPI = {
  getLots: () => apiClient.get('/lots'),
  getLot: (lotId: string) => apiClient.get(`/lots/${lotId}`),
  placeBid: (lotId: string, bidData: any) => apiClient.post(`/lots/${lotId}/bid`, bidData),
  getBids: (lotId: string) => apiClient.get(`/lots/${lotId}/bids`),
};

// Dashboard API calls
export const dashboardAPI = {
  getKPIs: () => apiClient.get('/dashboard/kpis'),
  getGradeData: () => apiClient.get('/dashboard/grade-data'),
};

// Notifications API calls
export const notificationsAPI = {
  getNotifications: () => apiClient.get('/notifications'),
  markAsRead: (id: number) => apiClient.patch(`/notifications/${id}/read`, {}),
  markAllAsRead: () => apiClient.patch('/notifications/mark-all-read', {}),
};
