/**
 * API Client for Backend Communication
 * 
 * This client handles all communication with the Express backend
 * running on port 3001
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: { email: string; password: string; name: string; role: string }) {
    const response = await this.client.post('/api/auth/register', data);
    return response.data;
  }

  async login(data: { email: string; password: string }) {
    const response = await this.client.post('/api/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  // Product endpoints
  async getProducts(params?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const response = await this.client.get('/api/products', { params });
    return response.data;
  }

  async getProduct(id: string) {
    const response = await this.client.get(`/api/products/${id}`);
    return response.data;
  }

  async createProduct(data: FormData) {
    const response = await this.client.post('/api/products', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async generateProductWithAI(data: {
    voiceFile?: File;
    imageFile?: File;
    textDescription?: string;
  }) {
    const formData = new FormData();
    if (data.voiceFile) formData.append('voice', data.voiceFile);
    if (data.imageFile) formData.append('image', data.imageFile);
    if (data.textDescription) formData.append('description', data.textDescription);

    const response = await this.client.post('/api/products/ai-generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Artisan endpoints
  async getArtisans(params?: { limit?: number; offset?: number }) {
    const response = await this.client.get('/api/artisans', { params });
    return response.data;
  }

  async getArtisan(id: string) {
    const response = await this.client.get(`/api/artisans/${id}`);
    return response.data;
  }

  async updateArtisan(id: string, data: any) {
    const response = await this.client.put(`/api/artisans/${id}`, data);
    return response.data;
  }

  // Generic request method for custom endpoints
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<T>(config);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
