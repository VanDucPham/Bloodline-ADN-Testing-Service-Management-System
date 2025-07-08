// src/pages/FeedbackManagement.jsx
import { Table, Card, Rate, Tag, Space, Button, Modal, Statistic, Row, Col, Progress, Tooltip } from 'antd';
import { useState, useMemo } from 'react';
import { EyeOutlined, StarFilled } from '@ant-design/icons';

function FeedbackManagement() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Sample data - replace with actual API data
  const feedbackData = [
    {
      id: 1,
      caseId: 'CASE001',
      rating: 5,
      comment: 'Dịch vụ rất tốt, nhân viên nhiệt tình',
      staffName: 'Nguyễn Văn A',
      date: '2024-03-15',
      status: 'active',
    },
    {
      id: 2,
      caseId: 'CASE002',
      rating: 4,
      comment: 'Kết quả nhanh chóng, đúng hẹn',
      staffName: 'Trần Thị B',
      date: '2024-03-14',
      status: 'active',
    },
    {
      id: 3,
      caseId: 'CASE003',
      rating: 5,
      comment: 'Rất hài lòng với dịch vụ',
      staffName: 'Nguyễn Văn A',
      date: '2024-03-13',
      status: 'active',
    },
    {
      id: 4,
      caseId: 'CASE004',
      rating: 3,
      comment: 'Cần cải thiện thời gian trả kết quả',
      staffName: 'Trần Thị B',
      date: '2024-03-12',
      status: 'inactive',
    },
    {
      id: 5,
      caseId: 'CASE005',
      rating: 2,
      comment: 'Nhân viên tư vấn chưa nhiệt tình',
      staffName: 'Nguyễn Văn A',
      date: '2024-03-10',
      status: 'active',
    },
    {
      id: 6,
      caseId: 'CASE006',
      rating: 1,
      comment: 'Không hài lòng với dịch vụ',
      staffName: 'Trần Thị B',
      date: '2024-03-09',
      status: 'inactive',
    },
  ];

  // Thống kê số lượng feedback theo số sao
  const ratingStats = useMemo(() => {
    const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbackData.forEach(fb => {
      if (stats[fb.rating] !== undefined) stats[fb.rating]++;
    });
    return stats;
  }, [feedbackData]);

  const total = feedbackData.length;
  const avgRating = total
    ? (feedbackData.reduce((sum, fb) => sum + fb.rating, 0) / total).toFixed(2)
    : 0;

  const columns = [
    {
      title: 'ID Hồ sơ',
      dataIndex: 'caseId',
      key: 'caseId',
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
      title: 'Nhân viên',
      dataIndex: 'staffName',
      key: 'staffName',
      width: 150,
    },
    {
      title: 'Ngày đánh giá',
      dataIndex: 'date',
      key: 'date',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hiển thị' : 'Ẩn'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedFeedback(record);
            setIsModalVisible(true);
          }}
        />
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
              value={total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Điểm trung bình"
              value={avgRating}
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
                  <Tooltip title={`${ratingStats[star]} đánh giá`}>
                    <div style={{ fontWeight: 500 }}>
                      <Rate disabled count={1} value={1} style={{ color: '#faad14' }} />
                      <span style={{ marginLeft: 4 }}>{star} sao</span>
                    </div>
                    <Progress
                      percent={total ? (ratingStats[star] / total) * 100 : 0}
                      showInfo={false}
                      strokeColor="#faad14"
                      strokeWidth={12}
                      style={{ marginTop: 6 }}
                    />
                    <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>
                      {ratingStats[star]} đánh giá
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
          rowKey="id"
          pagination={{ pageSize: 6 }}
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
              <h3 className="font-semibold">ID Hồ sơ:</h3>
              <p>{selectedFeedback.caseId}</p>
            </div>
            <div>
              <h3 className="font-semibold">Đánh giá:</h3>
              <Rate disabled defaultValue={selectedFeedback.rating} />
            </div>
            <div>
              <h3 className="font-semibold">Nhân viên:</h3>
              <p>{selectedFeedback.staffName}</p>
            </div>
            <div>
              <h3 className="font-semibold">Ngày đánh giá:</h3>
              <p>{selectedFeedback.date}</p>
            </div>
            <div>
              <h3 className="font-semibold">Nội dung đánh giá:</h3>
              <p className="mt-2">{selectedFeedback.comment}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default FeedbackManagement;
