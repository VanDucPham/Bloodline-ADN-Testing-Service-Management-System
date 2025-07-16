// ============================
// 4. USER SERVICE
// ============================
import BaseApiService from "./api/BaseApiService";
class UserService extends BaseApiService {
    async getProfile() { return this.get('/customer/Profile'); }
    async updateProfile(userData) { return this.put('/customer', userData); }
    async getAllUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.get(`/user/all?${queryString}`);
    }
    async changePassword(id,passwordData) {
        return this.put(`/customer/changePassword/${id}`, passwordData);
    }
    async getService(){
        return this.get('/customer/service')
    }
    async getUserById(id) { return this.get(`/user/${id}`); }
    async deleteUser(id) { return this.delete(`/user/${id}`); }
    async create_app(appointment){
        return this.post('/customer/appointment/create', appointment) ;
    }
    async checkAvailability(data){
return this.post('/customer/appointment/check-availability', data)
    }
   async getTimeSlot(){
    return this.get('/customer/appointment/time-slots')
   }
   async getListAppointment(){
    return this.get('/customer/appointmentList')
   }
  async cancelAppointment(data){
    return this.put(`/customer/appointment/${data}/cancel`);
  }
   async updateParticipant(id, data) {
    return this.put(`/customer/${id}/update`, data);
  }

  async getResult(appointmentId){
    return this.get(`/customer/result/get/${appointmentId}`);
  }

}
    

export default UserService
