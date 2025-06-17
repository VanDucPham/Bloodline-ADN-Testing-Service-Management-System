// ============================
// 2. API SERVICE MANAGER
// ============================
import axios from "axios";
import AuthService from "../authService"
import UserService from "../userService";
import adminService from "../adminService";
class ApiServiceManager {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';
        this.apiClient = axios.create({ baseURL: this.baseURL, headers: { 'Content-Type': 'application/json' } });
        this.isRefreshing = false;
        this.failedQueue = [];

        // Khởi tạo service
        this.auth = new AuthService(this);
        this.user = new UserService(this);
        this.admin = new adminService(this)
        
        
        

        this.initializeRequestInterceptor();
        this.initializeResponseInterceptor();
    }

    getToken() { return localStorage.getItem('authToken'); }
    getUser() { const user = localStorage.getItem('userInfo'); return user ? JSON.parse(user) : null; }

    processQueue(error, token = null) {
        this.failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve(token));
        this.failedQueue = [];
    }

    initializeRequestInterceptor() {
        this.apiClient.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) { config.headers['Authorization'] = `Bearer ${token}`; }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    initializeResponseInterceptor() {
        this.apiClient.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        return new Promise((resolve, reject) => this.failedQueue.push({ resolve, reject }))
                            .then((token) => { originalRequest.headers['Authorization'] = `Bearer ${token}`; return this.apiClient(originalRequest); })
                            .catch(err => Promise.reject(err));
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        const refreshResponse = await axios.post(`${this.baseURL}/auth/refresh`, {}, { headers: { 'Authorization': `Bearer ${this.getToken()}` } });
                        const newToken = refreshResponse.data.token;

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
}
export default ApiServiceManager ;
