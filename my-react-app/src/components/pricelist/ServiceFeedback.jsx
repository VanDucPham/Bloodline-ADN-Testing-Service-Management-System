import React, { useState, useEffect } from 'react';
import { Rate, Card, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import apiService from '../../service/api';
import './Pricelist.css';

const ServiceFeedback = ({ serviceId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedbackData();
  }, [serviceId]);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      let feedbacksResponse = [];
      if (serviceId) {
        // Lấy feedback theo service nếu có serviceId
        if (apiService.auth.getFeedbackByService) {
          feedbacksResponse = await apiService.auth.getFeedbackByService(serviceId);
        } else if (apiService.feedback.getFeedbackByService) {
          feedbacksResponse = await apiService.feedback.getFeedbackByService(serviceId);
        }
      } else {
        // Lấy toàn bộ feedback nếu không truyền serviceId
        feedbacksResponse = await apiService.feedback.getAllFeedback();
      }
      // Lấy tên của từng user
      const feedbacksWithNames = await Promise.all(
        feedbacksResponse.map(async (feedback) => {
          try {
            const userResponse = await apiService.user.getUserById(feedback.userId);
            return {
              ...feedback,
              userName: userResponse.name
            };
          } catch (error) {
            console.error('Lỗi khi lấy tên user:', error);
            return {
              ...feedback,
              userName: `Khách hàng #${feedback.userId}`
            };
          }
        })
      );
      setFeedbacks(feedbacksWithNames);
      setError('');
    } catch (error) {
      console.error('Lỗi khi lấy feedback:', error);
      setError('Không thể tải đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="feedback-section">
        <h3>Đánh giá từ khách hàng</h3>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Đang tải đánh giá...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feedback-section">
        <h3>Đánh giá từ khách hàng</h3>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#ff4d4f' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-section">
      <h3>Đánh giá từ khách hàng</h3>
      
      {/* Danh sách feedback */}
      {feedbacks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Chưa có đánh giá nào cho dịch vụ này
        </div>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {feedbacks.map((feedback) => (
            <Card 
              key={feedback.feedbackId} 
              size="small" 
              style={{ marginBottom: '1rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <Avatar icon={<UserOutlined />} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 'bold' }}>
                      {feedback.userName}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      {formatDate(feedback.feedbackDate)}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.5rem' }}>
                    <Rate disabled defaultValue={feedback.rating} />
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#f9f9f9', 
                    padding: '0.5rem', 
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {feedback.feedbackText}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceFeedback; 