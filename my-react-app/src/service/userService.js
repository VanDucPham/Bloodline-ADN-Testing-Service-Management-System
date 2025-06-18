// ============================
// 4. USER SERVICE
// ============================
import BaseApiService from "./api/BaseApiService";
class UserService extends BaseApiService {
    async getProfile() { return this.get('/user/profile'); }
    async updateProfile(userData) { return this.put('/user/profile', userData); }
    async getAllUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.get(`/user/all?${queryString}`);
    }
    async getUserById(id) { return this.get(`/user/${id}`); }
    async deleteUser(id) { return this.delete(`/user/${id}`); }
    async changePassword(passwordData) { return this.post('/user/change-password', passwordData); }
    async create_app(appointment){
        return this.post('/create_appointment', appointment) ;
    }
    async add_paticipant(participant){
        return this.post('/add_patici')
    }
}
    

export default UserService
