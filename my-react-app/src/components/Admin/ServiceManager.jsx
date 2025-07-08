// src/pages/ServiceManager.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
} from "antd";
import apiService from "../../service/api"; // sửa lại đúng path nếu khác

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form] = Form.useForm();

  // Fetch tất cả service từ API
  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await apiService.admin.getAllService();
      setServices(data);
    } catch (error) {
      console.error("Lỗi khi tải dịch vụ:", error);
      message.error("Không thể tải danh sách dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openModal = (service = null) => {
    setEditingService(service);
    setIsModalOpen(true);
    if (service) {
      form.setFieldsValue(service);
    } else {
      form.resetFields();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingService) {
        await apiService.admin.updateService(editingService.serviceId, values);
        message.success("Đã cập nhật dịch vụ!");
      } else {
        await apiService.admin.createService(values);
        message.success("Đã thêm dịch vụ mới!");
      }
      closeModal();
      fetchServices();
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      message.error("Thao tác không thành công.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiService.admin.deleteService(id);
      message.success("Đã xóa dịch vụ!");
      fetchServices();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      message.error("Không thể xóa dịch vụ.");
    }
  };

  const columns = [
    { title: "Tên dịch vụ", dataIndex: "serviceName", key: "serviceName" },
    {
      title: "Giá (VNĐ)",
      dataIndex: "servicePrice",
      key: "servicePrice",
      render: (v) => v.toLocaleString(),
    },
    {
      title: "Mô tả",
      dataIndex: "serviceDescription",
      key: "serviceDescription",
      ellipsis: true,
    },
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url) => (
        <img
          src={url}
          alt="Dịch vụ"
          width={60}
          style={{ borderRadius: 4, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Số người",
      dataIndex: "limitPeople",
      key: "limitPeople",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa dịch vụ này?"
            onConfirm={() => handleDelete(record.serviceId)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
      <h2>Quản lý Dịch vụ</h2>
      <p>Thêm, sửa, xóa các dịch vụ xét nghiệm ADN.</p>
      <Button
        type="primary"
        onClick={() => openModal()}
        style={{ marginBottom: 16 }}
      >
        + Thêm dịch vụ
      </Button>
      <Table
        dataSource={services}
        columns={columns}
        rowKey="serviceId"
        loading={loading}
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
            name="serviceName"
            rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá (VNĐ)"
            name="servicePrice"
            rules={[
              { required: true, message: "Vui lòng nhập giá!" },
              {
                type: "number",
                min: 0,
                message: "Giá phải là số dương!",
                transform: (v) => Number(v),
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="serviceDescription"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Hình ảnh (URL)"
            name="imageUrl"
            rules={[{ required: true, message: "Vui lòng nhập URL hình ảnh!" }]}
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Form.Item
            label="Số lượng người tham gia"
            name="limitPeople"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng người!" },
              {
                type: "number",
                min: 1,
                message: "Số lượng phải >= 1",
                transform: (v) => Number(v),
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceManager;
