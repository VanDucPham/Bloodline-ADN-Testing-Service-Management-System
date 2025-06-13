import axios from "axios";

// ============================
// 1. BASE API SERVICE
// ============================ 
class BaseApiService {
    constructor(manager) {
        this.manager = manager;
    }

    getHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        const token = localStorage.getItem('authToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.manager.baseURL}${endpoint}`;
        const config = { url, headers: this.getHeaders(), ...options };

        try {
            const response = await axios(config);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || `HTTP Error: ${error.response?.status}`;
            console.error(`API Error - ${endpoint}:`, errorMessage);
            throw new Error(errorMessage);
        }
    }

    get(endpoint) { return this.request(endpoint, { method: 'GET' }); }
    post(endpoint, data) { return this.request(endpoint, { method: 'POST', data }); }
    put(endpoint, data) { return this.request(endpoint, { method: 'PUT', data }); }
    delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
}
export default BaseApiService





