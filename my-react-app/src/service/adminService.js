import BaseApiService from "./api/BaseApiService";
class adminService extends BaseApiService{
     async getAllUser(){
        return this.get("/admin/alluser")

        
     }
     async createUser(data){
      return this.post('/admin/create', data)
     }
     async deleteUser(id){
      return this.delete(`/admin/delete/${id}`)
     }
     async updateUser(id,user){
      return this.put(`/admin/update/${id}`, user)
     }
    async check_mail(email) {
    return this.get('/admin/check-email', { params: { email } })
    
}
   async importFileUser(formData) {
      console.log("chạy rồi")
      console.log(formData)
      return this.post('/admin/import_user', formData)
      
    }

    // ========== TIME SLOT LIMIT APIs ==========
    
    // Lấy tất cả khung giờ
    async getAllTimeSlots() {
        return this.get('/admin/time-slot/all')
    }

    // Tạo khung giờ mới
    async createTimeSlot(data) {
        return this.post('/admin/time-slot/create', data)
    }

    // Cập nhật khung giờ
    async updateTimeSlot(data) {
        return this.put('/admin/time-slot/update', data)
    }

    // Xóa khung giờ
    async deleteTimeSlot(startTime, endTime) {
        return this.delete('/admin/time-slot/delete', { 
            params: { startTime, endTime } 
        })
    }

    // Lấy 1 khung giờ cụ thể
    async getTimeSlot(startTime, endTime) {
        return this.get('/admin/time-slot/get', { 
            params: { startTime, endTime } 
        })
    }

}
export default adminService