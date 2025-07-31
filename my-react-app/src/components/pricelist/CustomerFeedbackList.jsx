import React, { useEffect, useState } from 'react';
import { Rate, Card, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import apiService from '../../service/api';
import './Pricelist.css';

const CustomerFeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      // Gọi API public lấy feedback (ví dụ: /feedback/public hoặc /feedback/for-customer)
      // Backend đã trả về userName, không cần gọi thêm API lấy tên user
      const res = await apiService.feedback.getPublicFeedback();
      setFeedbacks(res);
      setError('');
    } catch (err) {
      setError('Không thể tải đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
  };

  if (loading) return <div className="feedback-section">Đang tải đánh giá...</div>;
  if (error) return <div className="feedback-section" style={{color:'#ff4d4f'}}>{error}</div>;

  return (
    <div className="feedback-section">
      {feedbacks.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666' }}>Chưa có đánh giá nào</div>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {feedbacks
            .slice() // copy mảng để không ảnh hưởng state
            .sort((a, b) => new Date(b.feedbackDate) - new Date(a.feedbackDate)) // mới nhất lên đầu
            .slice(0, 5) // chỉ lấy 5 feedback mới nhất
            .map((feedback) => (
              <Card key={feedback.feedbackId} size="small" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <Avatar icon={<UserOutlined />} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{feedback.userName}</div>
                        <div style={{ fontStyle: 'italic', color: '#1890ff', fontSize: '0.95em' }}>{feedback.serviceName}</div>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>{formatDate(feedback.feedbackDate)}</div>
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <Rate disabled defaultValue={feedback.rating} />
                    </div>
                    <div style={{ backgroundColor: '#f9f9f9', padding: '0.5rem', borderRadius: '4px', fontSize: '0.9rem', lineHeight: '1.4' }}>
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

export default CustomerFeedbackList;
