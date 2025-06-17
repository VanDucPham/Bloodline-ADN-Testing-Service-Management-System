// ============================
// 3. AUTH SERVICE
// ============================
import axios from "axios";
import BaseApiService from "../service/api/BaseApiService"
class AuthService extends BaseApiService {
    async login(credentials) {
        const response = await this.post('/auth/login', credentials);
        if (response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userInfo', JSON.stringify({
                token: response.token,
            role: response.role,
            fullName: response.fullName,
            email: response.email
            }));
        }
        return response;
    }

    async register(userData) { return this.post('/auth/register', userData); }

    async logout() {
        try { await this.post('/auth/logout'); } catch (error) { console.error('Logout error:', error); }
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
    }

    async refreshToken() {
        const response = await this.post('/auth/refresh');
        if (response.token) { localStorage.setItem('authToken', response.token); }
        return response;
    }

    isAuthenticated() { return !!localStorage.getItem('authToken'); }
    getCurrentUser() {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    }
}
export default AuthService