import React, { useState } from 'react';
import './FeedBack.css';
import apiService from '../../service/api';

const Feedback = ({ appointment_id, service_id }) => {
  const [formData, setFormData] = useState({
    feedbackText: '',
    rating: 5
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Kiểm tra token
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Bạn cần đăng nhập để gửi phản hồi');
      }

      // Kiểm tra có appointment_id và service_id không
      if (!appointment_id || !service_id) {
        throw new Error('Thiếu thông tin lịch hẹn hoặc dịch vụ');
      }

      // Sử dụng feedback service - chỉ gửi feedbackText và rating
      const result = await apiService.feedback.createFeedback(formData, appointment_id, service_id);
      console.log('Đã gửi thành công:', result);
      setMessage('✅ Gửi phản hồi thành công!');

      // Reset form
      setFormData({
        feedbackText: '',
        rating: 5
      });
    } catch (error) {
      console.error('Gửi thất bại:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Gửi phản hồi thất bại';
      setMessage(`❌ ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`feedback-form-container ${isLoading ? 'loading' : ''}`}>
      <h2>Gửi Phản Hồi</h2>
      <form onSubmit={handleSubmit}>
        <label>Phản hồi:</label>
        <textarea
          name="feedbackText"
          value={formData.feedbackText}
          onChange={handleChange}
          rows="4"
          required
          placeholder="Hãy chia sẻ trải nghiệm của bạn về dịch vụ..."
        />

        <label>Đánh giá (1-5):</label>
        <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
        >
          {[5, 4, 3, 2, 1].map((star) => (
            <option key={star} value={star}>{star} sao</option>
          ))}
        </select>

        <button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? 'Đang gửi...' : 'Gửi phản hồi'}
        </button>
        
        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default Feedback;
