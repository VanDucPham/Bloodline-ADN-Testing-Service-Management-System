// src/pages/ServiceManager.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Popconfirm,
  message,
  Upload,
  Typography,
  Select,
  Tag,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import apiService from "../../service/api";

const { Paragraph, Text: AntText } = Typography;
const { Option } = Select;

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [participantTypes, setParticipantTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form] = Form.useForm();

  // Lấy danh sách dịch vụ
  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await apiService.admin.getAllService();
      console.log(data);
      setServices(data);
    } catch (error) {
      console.error("Lỗi khi tải dịch vụ:", error);
      message.error("Không thể tải danh sách dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách loại người tham gia
  const fetchParticipantTypes = async () => {
    try {
      const data = await apiService.admin.getAllParticipantTypes();
      setParticipantTypes(data);
    } catch (error) {
      console.error("Lỗi khi tải loại người tham gia:", error);
      message.error("Không thể tải danh sách loại người tham gia.");
    }
  };

  useEffect(() => {
    fetchServices();
    fetchParticipantTypes();
  }, []);

  // Mở modal (sửa hoặc thêm mới)
  const openModal = (service = null) => {
    setEditingService(service);
    setIsModalOpen(true);
    if (service) {
      form.setFieldsValue({
        ...service,
        participantsType: service.participantsType?.map((p) => p.id),
        imageFile: service.imageUrl
          ? [{ uid: "-1", name: "current.jpg", status: "done", url: service.imageUrl }]
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

  // Lưu dịch vụ (thêm hoặc cập nhật)
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      let imageUrl = editingService?.imageUrl || "";

      // Nếu có upload ảnh mới -> upload lên Cloudinary
      if (
        values.imageFile &&
        values.imageFile.length > 0 &&
        values.imageFile[0].originFileObj
      ) {
        const file = values.imageFile[0].originFileObj;
        const response = await apiService.admin.uploadImage(file);
        imageUrl = response.data?.url || response.url;
      }

      const payload = {
        serviceName: values.serviceName,
        servicePrice: Number(values.servicePrice), // Ép kiểu sang số
        serviceDescription: values.serviceDescription,
        imageUrl,
        participantsType: values.participantsType.map((id) => {
          const pt = participantTypes.find((p) => p.id === id);
          return { id: pt.id, participantType: pt.participantType };
        }),
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
      const errorMessage =
        error.response?.data?.message || error.message || "Thao tác không thành công.";
      message.error(errorMessage);
    }
  };

  // Xóa dịch vụ
  const handleDelete = async (service) => {
    try {
      await apiService.admin.deleteService(service.serviceId);
      message.success(`Đã xóa dịch vụ "${service.serviceName}"!`);
      fetchServices();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      const backendMessage = error.response?.data;
      if (backendMessage?.includes("đang được sử dụng")) {
        message.error(backendMessage);
      } else {
        message.error("Không thể xóa dịch vụ. Vui lòng thử lại.");
      }
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
      title: "Người tham gia",
      dataIndex: "participantsType",
      key: "participantsType",
      render: (types) =>
        types && types.length > 0
          ? types.map((t) => <Tag key={t.id}>{t.participantType}</Tag>)
          : "—",
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
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <ExclamationCircleOutlined style={{ color: "#faad14", marginRight: 8 }} />
                  <AntText strong>Xác nhận xóa dịch vụ</AntText>
                </div>
                <Paragraph style={{ marginBottom: 8 }}>
                  Bạn có chắc chắn muốn xóa dịch vụ{" "}
                  <AntText strong>"{record.serviceName}"</AntText>?
                </Paragraph>
                <Paragraph
                  type="warning"
                  style={{ fontSize: "12px", marginBottom: 0 }}
                >
                  ⚠️ Lưu ý: Hành động này không thể hoàn tác. Nếu dịch vụ đang được
                  sử dụng, việc xóa có thể ảnh hưởng đến các lịch hẹn hiện có.
                </Paragraph>
              </div>
            }
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
            icon={<ExclamationCircleOutlined style={{ color: "#faad14" }} />}
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
        pagination={{ pageSize: 10 }}
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
          {/* Tên dịch vụ */}
          <Form.Item
            label="Tên dịch vụ"
            name="serviceName"
            rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
          >
            <Input disabled={editingService && editingService.inUse} />
          </Form.Item>

          {/* Giá dịch vụ */}
          <Form.Item
            label="Giá (VNĐ)"
            name="servicePrice"
            rules={[
              { required: true, message: "Vui lòng nhập giá!" },
              { type: "number", min: 0, message: "Giá phải lớn hơn hoặc bằng 0!" },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              disabled={editingService && editingService.inUse}
            />
          </Form.Item>

          {/* Người tham gia */}
          <Form.Item
            label="Người tham gia"
            name="participantsType"
            rules={[{ required: true, message: "Vui lòng chọn người tham gia!" }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn loại người tham gia"
              disabled={editingService && editingService.inUse}
            >
              {participantTypes.map((pt) => (
                <Option key={pt.id} value={pt.id}>
                  {pt.participantType}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Mô tả dịch vụ */}
          <Form.Item
            label="Mô tả dịch vụ"
            name="serviceDescription"
            rules={[{ required: true, message: "Vui lòng nhập mô tả dịch vụ!" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả dịch vụ" />
          </Form.Item>

          {/* Upload hình ảnh */}
          <Form.Item
            label="Hình ảnh dịch vụ"
            name="imageFile"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: !editingService, message: "Vui lòng chọn hình ảnh!" }]}
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false} // Không upload ngay
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceManager;
