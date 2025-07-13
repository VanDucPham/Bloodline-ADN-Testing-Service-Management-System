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
    async getService(){
        return this.get('/customer/appointment/services')
    }
    async getUserById(id) { return this.get(`/user/${id}`); }
    async deleteUser(id) { return this.delete(`/user/${id}`); }
    async changePassword(passwordData) { return this.post('/user/change-password', passwordData); }
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
  async creatPaymentVnPay(data){
    return this.post('/auth/vnpay/create', data)
  }
  async getAllServicePrice(){
    return this.get('/auth/getService')
  }
}
    

export default UserService
