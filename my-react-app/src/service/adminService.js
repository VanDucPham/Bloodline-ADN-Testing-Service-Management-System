import BaseApiService from "./api/BaseApiService";
class adminService extends BaseApiService {
   async getAllUser() {
      return this.get("/admin/alluser")


   }
   async createUser(data) {
      return this.post('/admin/create', data)
   }
   async deleteUser(id) {
      return this.delete(`/admin/delete/${id}`)
   }
   async updateUser(id, user) {
      return this.put(`/admin/update/${id}`, user)
   }
   async check_mail(email) {
      return this.get('/admin/check-email', { params: { email } })

   }

   async getAllService(){
      return this.get('/admin/service/get')
   }

   async createService(service) {
      return this.post('/admin/service/add', service)
   }

   async importFileUser(formData) {
      console.log("chạy rồi")
      console.log(formData)
      return this.post('/admin/import_user', formData)

   }
   async getServiceById(id) {
      return this.get(`/admin/service/get/${id}`);
   }

   async updateService(id, service) {
      return this.put(`/admin/service/update/${id}`, service);
   }

   async deleteService(id) {
      return this.delete(`/admin/service/delete/${id}`);
   }


}
export default adminService