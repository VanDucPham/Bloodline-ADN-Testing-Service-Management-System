import { Tabs, Card, Button, Table, Space, Modal, Form, Input, InputNumber } from 'antd';
import { useState } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

function SettingsManagement() {
  const [activeTab, setActiveTab] = useState('1');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);

  // Sample data - replace with actual API data
  const serviceData = [
    { id: 1, name: 'Xét nghiệm ADN cha con', price: 2000000, description: 'Xét nghiệm ADN xác định quan hệ cha con' },
    { id: 2, name: 'Xét nghiệm ADN mẹ con', price: 2000000, description: 'Xét nghiệm ADN xác định quan hệ mẹ con' },
  ];

  const blogData = [
    { id: 1, title: 'Quy trình xét nghiệm ADN', content: 'Nội dung bài viết...', author: 'Admin', date: '2024-03-15' },
    { id: 2, title: 'Độ chính xác của xét nghiệm ADN', content: 'Nội dung bài viết...', author: 'Admin', date: '2024-03-14' },
  ];

  const serviceColumns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString()} ₫`,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const blogColumns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa mục này?',
      onOk() {
        // Handle delete
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      // Handle save
      setIsModalVisible(false);
      form.resetFields();
      setEditingRecord(null);
    });
  };

  const items = [
    {
      key: '1',
      label: 'Cấu hình dịch vụ',
      children: (
        <div>
          <div className="flex justify-end mb-4">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRecord(null);
                form.resetFields();
                setIsModalVisible(true);
              }}
            >
              Thêm dịch vụ
            </Button>
          </div>
          <Table columns={serviceColumns} dataSource={serviceData} />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Quản lý blog',
      children: (
        <div>
          <div className="flex justify-end mb-4">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRecord(null);
                form.resetFields();
                setIsModalVisible(true);
              }}
            >
              Thêm bài viết
            </Button>
          </div>
          <Table columns={blogColumns} dataSource={blogData} />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
       
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
        />
      </Card>

      <Modal
        title={editingRecord ? 'Chỉnh sửa' : 'Thêm mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingRecord(null);
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          {activeTab === '1' ? (
            <>
              <Form.Item
                name="name"
                label="Tên dịch vụ"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="price"
                label="Giá"
                rules={[{ required: true }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
              <Form.Item
                name="description"
                label="Mô tả"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                name="title"
                label="Tiêu đề"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="content"
                label="Nội dung"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={6} />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default SettingsManagement; 