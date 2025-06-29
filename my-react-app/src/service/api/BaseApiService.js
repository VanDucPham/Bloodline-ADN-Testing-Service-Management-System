import axios from "axios";

// ============================
// 1. BASE API SERVICE
// ============================ 
class BaseApiService {
    constructor(manager) {
        this.manager = manager;
    }

    getHeaders(data, optionsHeaders = {}) {
        const token = localStorage.getItem('authToken');
        const isFormData = data instanceof FormData;

        const headers = {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...optionsHeaders // Ưu tiên headers truyền vào
        };

        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.manager.baseURL}${endpoint}`;
        const data = options.data || null;
        const params = options.params || undefined; // <-- Thêm dòng này

        const config = {
            method: options.method || 'GET',
            url,
            headers: this.getHeaders(data, options.headers || {}),
           ...(options.method === 'GET' ? { params } : { data }) // <-- xử lý params đúng cho GET
        };

        try {
            const response = await axios(config);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || `HTTP Error: ${error.response?.status}`;
            console.error(`API Error - ${endpoint}:`, errorMessage);
            throw new Error(errorMessage);
        }
    }

    get(endpoint, options = {}) {
        return this.request(endpoint, { method: 'GET', ...options });
    }

    post(endpoint, data, options = {}) {
        return this.request(endpoint, { method: 'POST', data, ...options });
    }

    put(endpoint, data, options = {}) {
        return this.request(endpoint, { method: 'PUT', data, ...options });
    }

    delete(endpoint, options = {}) {
        return this.request(endpoint, { method: 'DELETE', ...options });
    }
}

export default BaseApiService;
