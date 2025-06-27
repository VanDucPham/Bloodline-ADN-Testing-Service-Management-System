import axios from "axios";
const api = axios.create({ 
   baseURL: "http://localhost:8080/api",  
   headers: { 'Content-Type': 'application/json' } 
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("authToken"); // Lấy token từ localStorage (hoặc nơi bạn lưu trữ)

    if (accessToken) {
   
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Thêm các headers mặc định nếu cần
// api.defaults.headers.common["Authorization"] = "Bearer YOUR_ACCESS_TOKEN";
// Đặt cookies vào tiêu đề yêu cầu (nếu có)

export const getData = async (endpoint, params = {}, headers = {}) => {
  try {
    const response = await api.get(endpoint, { params, headers });
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
      throw error;
    } else {
      throw error;
    }
  }
};
export const postData = async (endpoint, data, headers = {}) => {
  try {
    const response = await api.post(endpoint, data, { headers });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // window.location.href = "/login";
      throw error.response || error;
    } else {
      throw error.response || error;
    }
  }
};

export const putData = async (endpoint, id, data, headers = {}) => {
  try {
    const response = await api.put(`${endpoint}/${id}`, data, { headers });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    } else {
      throw error;
    }
  }
};

export const deleteData = async (endpoint, id, data, headers = {}) => {
  try {
    const response = await api.delete(`${endpoint}/${id}`, { headers, data });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    } else {
      throw error;
    }
  }
};
