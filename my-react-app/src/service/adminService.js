import BaseApiService from "./api/BaseApiService";
class adminService extends BaseApiService{
     async getAllUser(){
        return this.get("/admin/alluser")

        
     }
     async deleteUser(id){
      return this.delete(`/admin/delete/${id}`)
     }
}
export default adminService