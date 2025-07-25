
import axios from "axios";
import AuthService from "../authService";
import UserService from "../userService.js";


import FeedbackService from "../feedbackService"; // Import FeedbackService
import ManagerService from "../managerService";
import StaffService from "../staffservice";
import AdminService from "../adminService";
  

class ApiServiceManager {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL|| 'http://localhost:8080/api';
    console.log("Base API URL:", import.meta.env.VITE_API_BASE_URL);

    this.apiClient = axios.create({
      baseURL: this.baseURL,
      headers: { 'Content-Type': 'application/json' }  // default JSON
    });
    this.isRefreshing = false;
    this.failedQueue = [];

    // Khởi tạo service
    this.auth = new AuthService(this);
    this.user = new UserService(this);
    this.admin = new AdminService(this);
    this.staff = new StaffService(this); 
    this.feedback = new FeedbackService(this); // Thêm FeedbackService
    this.manager = new ManagerService(this);

    this.initializeRequestInterceptor();
    this.initializeResponseInterceptor();
  }

  getToken() {
    return localStorage.getItem('authToken');
  }
  getUser() {
    const user = localStorage.getItem('userInfo');
    return user ? JSON.parse(user) : null;
  }

  processQueue(error, token = null) {
    this.failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve(token));
    this.failedQueue = [];
  }

  initializeRequestInterceptor() {
    this.apiClient.interceptors.request.use(
      config => {
        // Nếu data là FormData, xoá Content-Type JSON để axios tự thêm multipart/form-data
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }

        // Thêm Authorization header nếu có token
        const token = this.getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );
  }

  initializeResponseInterceptor() {
    this.apiClient.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) =>
              this.failedQueue.push({ resolve, reject })
            ).then(token => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return this.apiClient(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;
          try {
            const refreshRes = await axios.post(
              `${this.baseURL}/auth/refresh`,
              {},
              { headers: { 'Authorization': `Bearer ${this.getToken()}` } }
            );
            const newToken = refreshRes.data.token;
            localStorage.setItem('authToken', newToken);
            this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            this.processQueue(null, newToken);
            return this.apiClient(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Wrapper chung
  request(method, url, data = null, config = {}) {
    return this.apiClient.request({ method, url, data, ...config })
      .then(res => res)
      .catch(err => { throw err; });
  }

  get(url, params) {
    return this.request('get', url, null, { params });
  }

  post(url, data, config = {}) {
    return this.request('post', url, data, config);
  }

  put(url, data) {
    return this.request('put', url, data);
  }

  delete(url) {
    return this.request('delete', url);
  }

  // BLOG PUBLIC
  async getPublicBlogsPage(page = 0, size = 10) {
    return this.get('/blog/page', { page, size });
  }
  async getPublicBlogById(id) {
    return this.get(`/blog/${id}`);
  }

  // BLOG ADMIN
  async getAdminBlogsPage(params) {
    return this.get('/admin/blog/page', params);
  }
  async createAdminBlog(data) {
    return this.post('/admin/blog/create', data);
  }
  async updateAdminBlog(id, data) {
    return this.put(`/admin/blog/update/${id}`, data);
  }
  async deleteAdminBlog(id) {
    return this.delete(`/admin/blog/delete/${id}`);
  }
  async updateAdminBlogStatus(id, status) {
    return this.put(`/admin/blog/status/${id}?status=${status}`);
  }
  async uploadBlogImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiClient.post('/admin/blog/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  // Lấy số lượng blog theo từng loại từ BE
  async getBlogCategoryCount() {
    return this.get('/admin/blog/category-count');
  }

}

// Đo khoảng cách: chỉ kiểm tra hợp lệ địa chỉ (chứa 'Thủ Đức')
export async function getDistance(customerAddress) {
  const token = localStorage.getItem('authToken');
  const response = await fetch(
    `/api/distance/to-customer?customerAddress=${encodeURIComponent(customerAddress)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Khoảng cách không hợp lệ, yêu cầu nhập lại');
  }
  return true;
}

export default ApiServiceManager;
