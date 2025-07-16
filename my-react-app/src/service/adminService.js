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

   async getProfile() {
      return this.get('/admin/profile');
   }  

   async createBlog(blog) {
      return this.post('/admin/blog/create', blog);
   }

   async getAllBlog() {
      return this.get('/admin/blog/all');
   }

   async updateBlog(id, blog) {
      return this.put(`/admin/blog/update/${id}`, blog);
   }  

   async deleteBlog(id) {
      return this.delete(`/admin/blog/delete/${id}`);
   }
   
   async getBlogById(id) {
      return this.get(`/admin/blog/get/${id}`);
   }
    async getscheduleByMonth(month){
      return this.get(`/admin/case_schedule/${month}`);
   }
   async getStaffAssigned(){
      return this.get('/admin/staff_inf')
   }
   async addStaffAsigned(payload){
      return this.post('/admin/assign-staff', payload)
   }
   
  async uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  return this.post('/admin/upload', formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

}



export async function createAllowedArea(area) {
  const token = localStorage.getItem('authToken');
  const res = await fetch('/api/areas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(area)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateAllowedArea(id, area) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`/api/areas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(area)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteAllowedArea(id) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`/api/areas/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}


export default adminService;