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
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import apiService from "../../service/api"; // cập nhật path đúng

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form] = Form.useForm();

  // API upload ảnh
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("http://localhost:8080/api/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.url; // ví dụ: "/ImagePage/abc123.jpg"
  };

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
      form.setFieldsValue({
        ...service,
        imageFile: service.imageUrl
          ? [
              {
                uid: "-1",
                name: "current.jpg",
                status: "done",
                url: `http://localhost:8080${service.imageUrl}`,
              },
            ]
          : [],
      });
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

    let imageUrl = editingService?.imageUrl || "";

    if (
      values.imageFile &&
      values.imageFile.length > 0 &&
      values.imageFile[0].originFileObj
    ) {
      const file = values.imageFile[0].originFileObj;

      const response = await apiService.admin.uploadImage(file);
      // Nếu backend trả về dạng { url: "/ImagePage/abc.jpg" }
      imageUrl = response.data?.url || response.url;
    }

    const payload = {
      serviceName: values.serviceName,
      servicePrice: values.servicePrice,
      serviceDescription: values.serviceDescription,
      imageUrl, // chính là link ảnh vừa upload
      limitPeople: values.limitPeople,
    };

    if (editingService) {
      await apiService.admin.updateService(editingService.serviceId, payload);
      message.success("Đã cập nhật dịch vụ!");
    } else {
      await apiService.admin.createService(payload);
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
      await apiService.admin.deleteService(service.serviceId);
      message.success(`Đã xóa dịch vụ "${service.serviceName}"!`);
      fetchServices();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      const errorMessage = error.response?.data || error.message || "Không thể xóa dịch vụ. Có thể dịch vụ đang được sử dụng.";
      message.error(errorMessage);
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
          src={`http://localhost:8080${url}`}
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
            title={
              <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
                  <Text strong>Xác nhận xóa dịch vụ</Text>
                </div>
                <Paragraph style={{ marginBottom: 8 }}>
                  Bạn có chắc chắn muốn xóa dịch vụ <Text strong>"{record.serviceName}"</Text>?
                </Paragraph>
                <Paragraph type="warning" style={{ fontSize: '12px', marginBottom: 0 }}>
                  ⚠️ Lưu ý: Hành động này không thể hoàn tác. Nếu dịch vụ đang được sử dụng, 
                  việc xóa có thể ảnh hưởng đến các lịch hẹn hiện có.
                </Paragraph>
              </div>
            }
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
            icon={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
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
      <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
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
            label="Hình ảnh"
            name="imageFile"
            valuePropName="fileList"
            getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
            rules={[{ required: !editingService, message: "Vui lòng chọn ảnh!" }]}
          >
            <Upload beforeUpload={() => false} listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
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
