// src/service/api/index.js
import ApiServiceManager from './ApiServiceManage';

// Singleton instance - Đây là đối tượng chính bạn sẽ sử dụng trong toàn bộ ứng dụng
const apiService = new ApiServiceManager();

export default apiService;
export { apiService };

