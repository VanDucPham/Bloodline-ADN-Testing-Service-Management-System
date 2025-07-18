// src/pages/FeedbackManagement.jsx
import { Table, Card, Rate, Tag, Space, Button, Modal, Statistic, Row, Col, Progress, Tooltip, message } from 'antd';
import { useState, useEffect } from 'react';
import { EyeOutlined, StarFilled, DeleteOutlined } from '@ant-design/icons';
import apiService from '../../service/api';

function FeedbackManagement() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });

  // Fetch data từ backend
  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      
      // Lấy tất cả feedback
      const feedbacksResponse = await apiService.feedback.getAllFeedback();
      setFeedbackData(feedbacksResponse);
      
      // Lấy thống kê
      const statsResponse = await apiService.feedback.getFeedbackStats();
      setStats(statsResponse);
      
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu feedback:', error);
      message.error('Không thể tải dữ liệu feedback');
    } finally {
      setLoading(false);
    }
  };

  // Xóa feedback
  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await apiService.feedback.deleteFeedback(feedbackId);
      message.success('Đã xóa feedback thành công');
      fetchFeedbackData(); // Refresh lại data
    } catch (error) {
      console.error('Lỗi khi xóa feedback:', error);
      message.error('Không thể xóa feedback');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      title: 'ID Feedback',
      dataIndex: 'feedbackId',
      key: 'feedbackId',
      width: 120,
    },
    {
      title: 'ID Lịch hẹn',
      dataIndex: 'appointmentId',
      key: 'appointmentId',
      width: 120,
    },
    {
      title: 'ID Dịch vụ',
      dataIndex: 'serviceId',
      key: 'serviceId',
      width: 120,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      render: (rating) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: 'Nội dung',
      dataIndex: 'feedbackText',
      key: 'feedbackText',
      width: 200,
      render: (text) => (
        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Ngày đánh giá',
      dataIndex: 'feedbackDate',
      key: 'feedbackDate',
      width: 150,
      render: (date) => formatDate(date),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedFeedback(record);
              setIsModalVisible(true);
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteFeedback(record.feedbackId)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Quản lý Feedback</h1>
      
      {/* Thống kê tổng quan */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số feedback"
              value={stats.totalFeedbacks}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Điểm trung bình"
              value={stats.averageRating}
              precision={2}
              prefix={<StarFilled style={{ color: '#fadb14' }} />}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {[5, 4, 3, 2, 1].map(star => (
                <div key={star} style={{ textAlign: 'center', width: '18%' }}>
                  <Tooltip title={`${stats.ratingDistribution[star] || 0} đánh giá`}>
                    <div style={{ fontWeight: 500 }}>
                      <Rate disabled count={1} value={1} style={{ color: '#faad14' }} />
                      <span style={{ marginLeft: 4 }}>{star} sao</span>
                    </div>
                    <Progress
                      percent={stats.totalFeedbacks ? ((stats.ratingDistribution[star] || 0) / stats.totalFeedbacks) * 100 : 0}
                      showInfo={false}
                      strokeColor="#faad14"
                      size={12}
                      style={{ marginTop: 6 }}
                    />
                    <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>
                      {stats.ratingDistribution[star] || 0} đánh giá
                    </div>
                  </Tooltip>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* Bảng danh sách feedback */}
      <Card>
        <Table
          columns={columns}
          dataSource={feedbackData}
          rowKey="feedbackId"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>

      <Modal
        title="Chi tiết đánh giá"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedFeedback(null);
        }}
        footer={null}
        width={600}
      >
        {selectedFeedback && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">ID Feedback:</h3>
              <p>{selectedFeedback.feedbackId}</p>
            </div>
            <div>
              <h3 className="font-semibold">ID Lịch hẹn:</h3>
              <p>{selectedFeedback.appointmentId}</p>
            </div>
            <div>
              <h3 className="font-semibold">ID Dịch vụ:</h3>
              <p>{selectedFeedback.serviceId}</p>
            </div>
            <div>
              <h3 className="font-semibold">ID Người dùng:</h3>
              <p>{selectedFeedback.userId}</p>
            </div>
            <div>
              <h3 className="font-semibold">Đánh giá:</h3>
              <Rate disabled defaultValue={selectedFeedback.rating} />
            </div>
            <div>
              <h3 className="font-semibold">Ngày đánh giá:</h3>
              <p>{formatDate(selectedFeedback.feedbackDate)}</p>
            </div>
            <div>
              <h3 className="font-semibold">Nội dung đánh giá:</h3>
              <p className="mt-2" style={{ whiteSpace: 'pre-wrap' }}>
                {selectedFeedback.feedbackText}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default FeedbackManagement;
