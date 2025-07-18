import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, message, Popconfirm, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import apiService from '../../service/api';

const initialForm = { city: '', district: '', active: true, note: '' };

function AllowedAreaManager() {
  const [areas, setAreas] = useState([]);
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const data = await apiService.user.getAllowedAreas();
      setAreas(data);
    } catch (err) {
      message.error('Lỗi tải danh sách khu vực: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const openModal = (area = null) => {
    setEditing(area);
    setModalOpen(true);
    if (area) {
      form.setFieldsValue(area);
    } else {
      form.resetFields();
      form.setFieldsValue(initialForm);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await apiService.admin.updateAllowedArea(editing.id, values);
        message.success('Cập nhật khu vực thành công!');
      } else {
        await apiService.admin.createAllowedArea(values);
        message.success('Thêm khu vực thành công!');
      }
      setModalOpen(false);
      setEditing(null);
      fetchAreas();
    } catch (err) {
      if (err.errorFields) return; // AntD form validation
      message.error('Lỗi: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiService.admin.deleteAllowedArea(id);
      message.success('Xóa khu vực thành công!');
      fetchAreas();
    } catch (err) {
      message.error('Lỗi: ' + err.message);
    }
  };

  const columns = [
    { title: 'Thành phố', dataIndex: 'city', key: 'city', sorter: (a, b) => a.city.localeCompare(b.city) },
    { title: 'Quận/Huyện', dataIndex: 'district', key: 'district', sorter: (a, b) => a.district.localeCompare(b.district) },
    { title: 'Hoạt động', dataIndex: 'active', key: 'active', align: 'center',
      render: active => active ? <Tag color="green">Đang hoạt động</Tag> : <Tag color="red">Ngừng</Tag>
    },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note', ellipsis: true },
    {
      title: 'Hành động', key: 'action', align: 'center',
      render: (_, area) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(area)} size="small">Sửa</Button>
          <Popconfirm title="Bạn có chắc muốn xóa khu vực này?" onConfirm={() => handleDelete(area.id)} okText="Xóa" cancelText="Hủy">
            <Button icon={<DeleteOutlined />} danger size="small">Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Quản lý khu vực lấy mẫu tận nhà</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          Thêm khu vực
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={areas}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 8 }}
        style={{ background: '#fafcff', borderRadius: 8 }}
      />
      <Modal
        title={editing ? 'Cập nhật khu vực' : 'Thêm khu vực mới'}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => { setModalOpen(false); setEditing(null); }}
        okText={editing ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={initialForm}
        >
          <Form.Item name="city" label="Thành phố" rules={[{ required: true, message: 'Vui lòng nhập thành phố' }]}> 
            <Input placeholder="Nhập tên thành phố" autoFocus />
          </Form.Item>
          <Form.Item name="district" label="Quận/Huyện" rules={[{ required: true, message: 'Vui lòng nhập quận/huyện' }]}> 
            <Input placeholder="Nhập tên quận/huyện" />
          </Form.Item>
          <Form.Item name="active" label="Trạng thái" valuePropName="checked">
            <Switch checkedChildren="Đang hoạt động" unCheckedChildren="Ngừng" />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea placeholder="Ghi chú (tùy chọn)" autoSize={{ minRows: 2, maxRows: 4 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AllowedAreaManager; 