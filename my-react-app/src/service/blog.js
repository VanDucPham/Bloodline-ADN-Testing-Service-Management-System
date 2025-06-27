import BaseApiService from "./api/BaseApiService";
class blog extends BaseApiService {
    async getAllBlog() {
        return this.get("/blog")
    }
    async createBlog(data) {
        return this.post('/blog/create', data)
    }
    async deleteBlog(id) {
        return this.delete(`/blog/delete/${id}`)
    }
    async updateBlog(id, blog) {
        return this.put(`/blog/update/${id}`, blog)
    }


}
export default blog