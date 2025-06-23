import { Table, Card, Rate, Tag, Space, Button, Modal } from 'antd';
import { useState } from 'react';
import { EyeOutlined } from '@ant-design/icons';

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
  ];

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
      width: 150,
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
      <Card>
        <Table
          columns={columns}
          dataSource={feedbackData}
          rowKey="id"
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