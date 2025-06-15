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



}
export default adminService