import ApiServiceManager from './api/ApiServiceManage';

class FeedbackService {
  constructor(api) {
    this.api = api;
  }

  // Customer: Tạo feedback mới
  async createFeedback(feedbackData, appointmentId, serviceId) {
    try {
      const response = await this.api.post(`/feedback/create/${appointmentId}/${serviceId}`, feedbackData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo feedback:', error);
      throw error;
    }
  }

  // Customer: Lấy danh sách feedback của chính mình
  async getMyFeedback() {
    try {
      const response = await this.api.get('/feedback/my-feedback');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy feedback của tôi:', error);
      throw error;
    }
  }

  // Customer: Lấy chi tiết feedback theo ID
  async getMyFeedbackById(feedbackId) {
    try {
      const response = await this.api.get(`/feedback/my-feedback/${feedbackId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết feedback:', error);
      throw error;
    }
  }

  // Admin/Manager/Staff: Lấy tất cả feedback
  async getAllFeedback() {
    try {
      const response = await this.api.get('/feedback/all');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy tất cả feedback:', error);
      throw error;
    }
  }

  // Admin/Manager/Staff: Lấy feedback theo appointment
  async getFeedbackByAppointment(appointmentId) {
    try {
      const response = await this.api.get(`/feedback/by-appointment/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy feedback theo appointment:', error);
      throw error;
    }
  }

  // Admin: Xóa feedback
  async deleteFeedback(feedbackId) {
    try {
      const response = await this.api.delete(`/feedback/${feedbackId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa feedback:', error);
      throw error;
    }
  }

  // Admin/Manager: Lấy thống kê feedback
  async getFeedbackStats() {
    try {
      const response = await this.api.get('/feedback/stats');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thống kê feedback:', error);
      throw error;
    }
  }
}

export default FeedbackService; 