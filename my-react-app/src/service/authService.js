// ============================
// 3. AUTH SERVICE
// ============================
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
    // Google Login
    async googleLogin(googleTokenData) {
    const response = await this.post('/auth/google-login', googleTokenData);
    
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

    async getBlog() {
        return this.get('/auth/blog');
    }

    // Lấy feedback theo service ID (public - không cần đăng nhập)
    async getFeedbackByService(serviceId) {
        try {
            return await this.get(`/feedback/service/${serviceId}`);
        } catch (error) {
            console.error('Lỗi khi lấy feedback theo service:', error);
            throw error;
        }
    }

    // Lấy thống kê feedback theo service (public - không cần đăng nhập)
    async getFeedbackStatsByService(serviceId) {
        try {
            return await this.get(`/feedback/service/${serviceId}/stats`);
        } catch (error) {
            console.error('Lỗi khi lấy thống kê feedback theo service:', error);
            throw error;
        }
    }

    // Lấy thông tin user theo ID (public - không cần đăng nhập)
    async getUserById(userId) {
        try {
            return await this.get(`/auth/user/${userId}`);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin user:', error);
            throw error;
        }
    }
}
export default AuthService