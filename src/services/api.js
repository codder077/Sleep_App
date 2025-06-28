const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Set auth token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Get auth headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Make API request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setToken(null);
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // Sleep data methods
  async createSleepData(sleepData) {
    return this.request('/sleep', {
      method: 'POST',
      body: JSON.stringify(sleepData),
    });
  }

  async getSleepData(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/sleep?${queryString}` : '/sleep';
    return this.request(endpoint);
  }

  async getSleepDataById(id) {
    return this.request(`/sleep/${id}`);
  }

  async updateSleepData(id, sleepData) {
    return this.request(`/sleep/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sleepData),
    });
  }

  async deleteSleepData(id) {
    return this.request(`/sleep/${id}`, {
      method: 'DELETE',
    });
  }

  async getSleepStats() {
    return this.request('/sleep/stats');
  }

  async getPublicSleepData(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/sleep/public?${queryString}` : '/sleep/public';
    return this.request(endpoint);
  }

  // Utility methods
  async healthCheck() {
    return fetch(`${this.baseURL.replace('/api', '')}/health`).then(res => res.json());
  }

  async getApiDocs() {
    return this.request('');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Get token
  getToken() {
    return this.token;
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService; 