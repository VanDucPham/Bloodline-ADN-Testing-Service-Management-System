// src/service/adminService.js
import BaseApiService from "../service/api/BaseApiService"

class AdminService extends BaseApiService {
  // ====== USER ======
  async getAllUser() {
    return this.get("/admin/alluser");
  }

  async createUser(data) {
    return this.post('/admin/create', data);
  }

  async deleteUser(id) {
    return this.delete(`/admin/delete/${id}`);
  }

  async updateUser(id, user) {
    return this.put(`/admin/update/${id}`, user);
  }

  async check_mail(email) {
    return this.get('/admin/check-email', { params: { email } });
  }

  async importFileUser(formData) {
    console.log("Đang import file user...");
    return this.post('/admin/import_user', formData);
  }

  // ====== SERVICE ======
  async getAllService() {
    return this.get('/admin/service/get');
  }

  async createService(service) {
    return this.post('/admin/service/add', service);
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

  // ====== PROFILE ======
  async getProfile() {
    return this.get('/admin/profile');
  }

  // ====== BLOG ======
  async createBlog(blog) {
    return this.post('/admin/blog/create', blog);
  }

  async getAllBlog() {
    return this.get('/admin/blog/all');
  }

  async getBlogById(id) {
    return this.get(`/admin/blog/get/${id}`);
  }

  async updateBlog(id, blog) {
    return this.put(`/admin/blog/update/${id}`, blog);
  }

  async deleteBlog(id) {
    return this.delete(`/admin/blog/delete/${id}`);
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    return this.post('/admin/blog/upload-image', formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }

  // ====== SCHEDULE ======
  async getscheduleByMonth(month) {
    return this.get(`/admin/case_schedule/${month}`);
  }

  // ====== STAFF ======
  async getStaffAssigned() {
    return this.get('/admin/staff_inf');
  }

  async addStaffAsigned(payload) {
    return this.post('/admin/assign-staff', payload);
  }

  // ====== ALLOWED AREA ======
   async createAllowedArea(area) {

    return  this.post('/areas', area) ;
   //  fetch('/api/areas', {
   //    method: 'POST',
   //    headers: {
   //      'Content-Type': 'application/json',
   //      Authorization: `Bearer ${localStorage.getItem('authToken')}`
   //    },
   //    body: JSON.stringify(area)
   //  }).then(res => {
   //    if (!res.ok) throw new Error('Tạo khu vực thất bại');
   //    return res.json();
   //  });
  }

 // ...existing code...
  async updateAllowedArea(id, area) {
    return this.put(`/areas/${id}`, area);
  }
// ...existing code...
   //  fetch(`/api/areas/${id}`, {
   //    method: 'PUT',
   //    headers: {
   //      'Content-Type': 'application/json',
   //      Authorization: `Bearer ${localStorage.getItem('authToken')}`
   //    },
   //    body: JSON.stringify(area)
   //  }).then(res => {
   //    if (!res.ok) throw new Error('Cập nhật khu vực thất bại');
   //    return res.json();
   //  });
  

  async deleteAllowedArea(id) {
     return this.delete(`/api/areas/${id}`) ;
// 

//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('authToken')}`
//       }
//     }).then(res => {
//       if (!res.ok) throw new Error('Xóa khu vực thất bại');
//       return true;
//     });
//   }
}
}

export default AdminService;
