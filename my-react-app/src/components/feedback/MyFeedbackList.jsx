import React, { useState, useEffect } from 'react';
import apiService from '../../service/api';
import './FeedBack.css';

const MyFeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyFeedbacks();
  }, []);

  const fetchMyFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await apiService.feedback.getMyFeedback();
      setFeedbacks(response);
      setError('');
    } catch (error) {
      console.error('Lỗi khi lấy feedback:', error);
      setError('Không thể tải danh sách phản hồi');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div className="feedback-form-container">
        <h2>Danh sách phản hồi của tôi</h2>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Đang tải...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feedback-form-container">
        <h2>Danh sách phản hồi của tôi</h2>
        <div className="message error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-form-container">
      <h2>Danh sách phản hồi của tôi</h2>
      
      {feedbacks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Bạn chưa có phản hồi nào
        </div>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {feedbacks.map((feedback) => (
            <div 
              key={feedback.feedbackId} 
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: '#fff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 'bold' }}>
                  Đánh giá: {renderStars(feedback.rating)}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  {formatDate(feedback.feedbackDate)}
                </div>
              </div>
              
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Nội dung:</strong>
              </div>
              <div style={{ 
                backgroundColor: '#f9f9f9', 
                padding: '0.5rem', 
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}>
                {feedback.feedbackText}
              </div>
              
              <div style={{ 
                marginTop: '0.5rem', 
                fontSize: '0.8rem', 
                color: '#666',
                display: 'flex',
                gap: '1rem'
              }}>
                <span>ID Lịch hẹn: {feedback.appointmentId}</span>
                <span>ID Dịch vụ: {feedback.serviceId}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFeedbackList; 