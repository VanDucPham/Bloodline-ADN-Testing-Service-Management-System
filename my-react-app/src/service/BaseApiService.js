import { useState, useCallback } from 'react';
import axios from "axios";
// ============================
// 1. BASE API SERVICE
// ============================
class BaseApiService {
    constructor() { 
        this.baseURL =  'http://localhost:8080/api'; 
        this.token = localStorage.getItem('authToken');
    }
    
    // Cấu hình header chung
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // Method chung để gọi API
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = { 
            headers: this.getHeaders(), 
            ...options 
        };

        try {
            const response = await axios(url, config);

            return await response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message|| `HTTP Error: ${error.response?.status}`;
            console.error(`API Error - ${endpoint}:`, errorMessage);
            throw new Error(errorMessage);
        }
    }

    // Các method HTTP cơ bản
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: data,
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data,
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Update token khi login thành công
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    // Clear token khi logout
    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
    }
}

// ============================
// 2. AUTH SERVICE
// ============================
class AuthService extends BaseApiService {
    async login(credentials) {
        try {
            const response = await apiService.post('/auth/login', credentials);
            
            // Lưu token và user info
            if (response.token) {
                this.setToken(response.token);
                localStorage.setItem('userInfo', JSON.stringify(response.user));
            }
            
            return response;
        } catch (error) {
            throw new Error(error.message || 'Đăng nhập thất bại');
        }
    }

    async register(userData) {
        try {
            return await this.post('/auth/register', userData);
        } catch (error) {
            throw new Error(error.message || 'Đăng ký thất bại');
        }
    }

    async logout() {
        try {
            await this.post('/auth/logout');
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            this.clearToken();
        }
    }

    async refreshToken() {
        try {
            const response = await this.post('/auth/refresh');
            if (response.token) {
                this.setToken(response.token);
            }
            return response;
        } catch (error) {
            this.clearToken();
            throw error;
        }
    }

    // Kiểm tra user đã login chưa
    isAuthenticated() {
        return !!this.token;
    }

    // Lấy thông tin user hiện tại
    getCurrentUser() {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    }
}

// ============================
// 3. USER SERVICE
// ============================
class UserService extends BaseApiService {
    async getProfile() {
        return await this.get('/user/profile');
    }

    async updateProfile(userData) {
        return await this.put('/user/profile', userData);
    }

    async getAllUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.get(`/user/all?${queryString}`);
    }

    async getUserById(id) {
        return await this.get(`/user/${id}`);
    }

    async deleteUser(id) {
        return await this.delete(`/user/${id}`);
    }

    async changePassword(passwordData) {
        return await this.post('/user/change-password', passwordData);
    }
}

// ============================
// 4. BLOODLINE SERVICE
// ============================
class BloodlineService extends BaseApiService {
    async getBloodlineTree(userId) {
        return await this.get(`/bloodline/tree/${userId}`);
    }

    async addFamilyMember(memberData) {
        return await this.post('/bloodline/member', memberData);
    }

    async updateFamilyMember(id, memberData) {
        return await this.put(`/bloodline/member/${id}`, memberData);
    }

    async deleteFamilyMember(id) {
        return await this.delete(`/bloodline/member/${id}`);
    }

    async searchFamily(query) {
        return await this.get(`/bloodline/search?q=${encodeURIComponent(query)}`);
    }
}

// ============================
// 5. API SERVICE MANAGER
// ============================
class ApiServiceManager {
     constructor() {
        this.apiClient = axios.create({
            baseURL: 'http://localhost:8080/api',
            headers: { 'Content-Type': 'application/json' }
        });

        this.isRefreshing = false;
        this.failedQueue = [];

        this.initializeRequestInterceptor();
        this.initializeResponseInterceptor();
    }

    // Lấy token từ localStorage
    getToken() {
        return localStorage.getItem('authToken');
    }

    // Lấy user từ localStorage
    getUser() {
        const userJson = localStorage.getItem('userInfo');
        return userJson ? JSON.parse(userJson) : null;
    }

    // Xử lý queue khi refresh token thành công hoặc thất bại
    processQueue(error, token = null) {
        this.failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        this.failedQueue = [];
    }

    // Thêm interceptor cho request
    initializeRequestInterceptor() {
        this.apiClient.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    // Thêm interceptor cho response
    initializeResponseInterceptor() {
        this.apiClient.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        }).then((token) => {
                            originalRequest.headers['Authorization'] = `Bearer ${token}`;
                            return this.apiClient(originalRequest);
                        }).catch(err => Promise.reject(err));
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        const refreshResponse = await axios.post('http://localhost:8080/api/auth/refresh', {}, {
                            headers: { 'Authorization': `Bearer ${this.getToken()}` }
                        });

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

    // Các phương thức HTTP chuẩn
    async get(endpoint, config = {}) {
        return this.apiClient.get(endpoint, config);
    }

    async post(endpoint, data, config = {}) {
        return this.apiClient.post(endpoint, data, config);
    }

    async put(endpoint, data, config = {}) {
        return this.apiClient.put(endpoint, data, config);
    }

    async delete(endpoint, config = {}) {
        return this.apiClient.delete(endpoint, config);
    }
}





// ============================
// 6. REACT HOOKS FOR API
// ============================
// Sử dụng khi trong React component
const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const callApi = useCallback(async (apiFunction, ...args) => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await apiFunction(...args);
            return result.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { callApi, loading, error, setError };
};

// ============================
// 7. SINGLETON INSTANCE
// ============================
// Export singleton instance để sử dụng trong toàn bộ app
const apiService = new ApiServiceManager();

// Export các service riêng lẻ nếu cần
export {
    BaseApiService,
    AuthService,
    UserService,
    BloodlineService,
    ApiServiceManager,
    useApi,
    apiService
};

// Export default
export default apiService;

// ============================
// 8. USAGE EXAMPLES
// ============================
/*
// Sử dụng trong React component:

import apiService, { useApi } from './services/ApiService';

function LoginComponent() {
    const { callApi, loading, error } = useApi();
    
    const handleLogin = async (credentials) => {
        try {
            const result = await callApi(apiService.auth.login.bind(apiService.auth), credentials);
            console.log('Login success:', result);
        } catch (err) {
            console.error('Login failed:', err);
        }
    };
    
    return (
        <div>
            {loading && <p>Đang đăng nhập...</p>}
            {error && <p>Lỗi: {error}</p>}
            <button onClick={() => handleLogin({email: 'test@test.com', password: '123456'})}>
                Đăng nhập
            </button>
        </div>
    );
}

// Sử dụng trực tiếp:
async function getUserProfile() {
    try {
        const profile = await apiService.user.getProfile();
        console.log('User profile:', profile);
    } catch (error) {
        console.error('Error getting profile:', error);
    }
}
*/