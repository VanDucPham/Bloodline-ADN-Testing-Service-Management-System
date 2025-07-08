// src/pages/ServiceManager.jsx
import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from "antd";

const initialServices = [
  {
    id: 1,
    name: "Xét nghiệm ADN cha con",
    price: 2500000,
    description: "Dịch vụ xác định quan hệ huyết thống cha - con.",
  },
  {
    id: 2,
    name: "Xét nghiệm ADN mẹ con",
    price: 2500000,
    description: "Dịch vụ xác định quan hệ huyết thống mẹ - con.",
  },
];

const ServiceManager = () => {
  const [services, setServices] = useState(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [form] = Form.useForm();

  // Mở modal tạo mới hoặc chỉnh sửa
  const openModal = (service = null) => {
    setEditingService(service);
    setIsModalOpen(true);
    if (service) {
      form.setFieldsValue(service);
    } else {
      form.resetFields();
    }
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    form.resetFields();
  };

  // Lưu dịch vụ (thêm mới hoặc cập nhật)
  const handleSave = () => {
    form.validateFields().then(values => {
      if (editingService) {
        setServices(services.map(s => (s.id === editingService.id ? { ...editingService, ...values } : s)));
        message.success("Đã cập nhật dịch vụ!");
      } else {
        const newService = { ...values, id: Date.now() };
        setServices([newService, ...services]);
        message.success("Đã thêm dịch vụ mới!");
      }
      closeModal();
    });
  };

  // Xóa dịch vụ
  const handleDelete = (id) => {
    setServices(services.filter(s => s.id !== id));
    message.success("Đã xóa dịch vụ!");
  };

  const columns = [
    { title: "Tên dịch vụ", dataIndex: "name", key: "name" },
    { title: "Giá (VNĐ)", dataIndex: "price", key: "price", render: (v) => v.toLocaleString() },
    { title: "Mô tả", dataIndex: "description", key: "description", ellipsis: true },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openModal(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa dịch vụ này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
      <h2>Quản lý Dịch vụ</h2>
      <p>Thêm, sửa, xóa các dịch vụ xét nghiệm ADN.</p>
      <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
        + Thêm dịch vụ
      </Button>
      <Table
        dataSource={services}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={handleSave}
        okText={editingService ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên dịch vụ"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Giá (VNĐ)"
            name="price"
            rules={[
              { required: true, message: "Vui lòng nhập giá!" },
              { type: "number", min: 0, message: "Giá phải là số dương!", transform: v => Number(v) }
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceManager;
