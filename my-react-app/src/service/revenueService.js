import BaseApiService from "./api/BaseApiService";

const apiService = new BaseApiService();

const revenueService = {
  // Lấy tổng quan doanh thu
  getRevenueOverview: async (startDate = null, endDate = null) => {
    try {
      let url = '/api/admin/revenue/overview';
      const params = new URLSearchParams();
      
      if (startDate) {
        params.append('startDate', startDate.toISOString());
      }
      if (endDate) {
        params.append('endDate', endDate.toISOString());
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue overview:', error);
      throw error;
    }
  },

  // Lấy doanh thu theo tháng
  getRevenueByMonth: async (year, month) => {
    try {
      const response = await apiService.get(`/api/admin/revenue/monthly?year=${year}&month=${month}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly revenue:', error);
      throw error;
    }
  },

  // Lấy doanh thu theo service
  getRevenueByService: async (serviceId, startDate = null, endDate = null) => {
    try {
      let url = `/api/admin/revenue/service/${serviceId}`;
      const params = new URLSearchParams();
      
      if (startDate) {
        params.append('startDate', startDate.toISOString());
      }
      if (endDate) {
        params.append('endDate', endDate.toISOString());
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching service revenue:', error);
      throw error;
    }
  },

  // Lấy thống kê payment method
  getPaymentMethodStats: async (startDate = null, endDate = null) => {
    try {
      let url = '/api/admin/revenue/payment-methods';
      const params = new URLSearchParams();
      
      if (startDate) {
        params.append('startDate', startDate.toISOString());
      }
      if (endDate) {
        params.append('endDate', endDate.toISOString());
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment method stats:', error);
      throw error;
    }
  },

  // Lấy thống kê tăng trưởng
  getRevenueGrowth: async (startDate = null, endDate = null) => {
    try {
      let url = '/api/admin/revenue/growth';
      const params = new URLSearchParams();
      
      if (startDate) {
        params.append('startDate', startDate.toISOString());
      }
      if (endDate) {
        params.append('endDate', endDate.toISOString());
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue growth:', error);
      throw error;
    }
  },

  // Lấy top services theo doanh thu
  getTopServicesByRevenue: async (limit = 10, startDate = null, endDate = null) => {
    try {
      let url = `/api/admin/revenue/top-services?limit=${limit}`;
      const params = new URLSearchParams();
      
      if (startDate) {
        params.append('startDate', startDate.toISOString());
      }
      if (endDate) {
        params.append('endDate', endDate.toISOString());
      }
      
      if (params.toString()) {
        url += '&' + params.toString();
      }
      
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching top services:', error);
      throw error;
    }
  },

  // Lấy dữ liệu mẫu cho testing
  getSampleRevenueData: async () => {
    try {
      const response = await apiService.get('/api/admin/revenue/sample');
      return response.data;
    } catch (error) {
      console.error('Error fetching sample revenue data:', error);
      throw error;
    }
  }
};

export default revenueService; 