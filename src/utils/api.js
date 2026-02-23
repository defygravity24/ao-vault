import axios from 'axios';

class ApiClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid — clear token
          // AuthContext + PrivateRoute handle the redirect
          localStorage.removeItem('ao-vault-token');
          delete this.client.defaults.headers.common['Authorization'];
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.client.post('/auth/login', credentials);
  }

  async register(userData) {
    return this.client.post('/auth/register', userData);
  }

  async getCurrentUser() {
    return this.client.get('/auth/me');
  }

  // Fanfiction endpoints
  async getFanfictions(params) {
    return this.client.get('/fanfictions', { params });
  }

  async saveFanfiction(data) {
    return this.client.post('/fanfictions', data);
  }

  async updateBookmark(fanfictionId, data) {
    return this.client.patch(`/fanfictions/${fanfictionId}/bookmark`, data);
  }

  async deleteFanfiction(fanfictionId) {
    return this.client.delete(`/fanfictions/${fanfictionId}`);
  }

  async checkForUpdates(fanfictionId) {
    return this.client.post(`/fanfictions/${fanfictionId}/check-update`);
  }

  // Generic methods
  get(url, config) {
    return this.client.get(url, config);
  }

  post(url, data, config) {
    return this.client.post(url, data, config);
  }

  patch(url, data, config) {
    return this.client.patch(url, data, config);
  }

  delete(url, config) {
    return this.client.delete(url, config);
  }
}

export default new ApiClient();