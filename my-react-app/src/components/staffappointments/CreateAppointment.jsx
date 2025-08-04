// src/pages/CreateAppointment.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../../service/api';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, message, Typography } from 'antd';
import './CreateAppointment.css';

const { Option } = Select;
const { Title } = Typography;

const APPOINTMENT_TYPES = [
  { value: 'ADMINISTRATIVE', label: 'Hành chính' },
  { value: 'CIVIL', label: 'Dân sự' },
];

const STATUS_FLOW = ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED', 'CANCELLED'];
const COLLECTION_FLOW = ['ASSIGNED', 'TRAVELING', 'ARRIVED', 'COLLECTING', 'COMPLETED'];

function CreateAppointment() {
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [staffInfo, setStaffInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiService.staff.getAllServices();
        setServices(res);
        const staff = await apiService.staff.getStaffProfile();
        setStaffInfo(staff);
        form.setFieldsValue({ userId: staff.userId, appointmentStatus: 'SCHEDULED', collectionStatus: 'ASSIGNED' });
      } catch (e) {
        message.error('Lỗi khi tải dữ liệu dịch vụ hoặc thông tin nhân viên');
      }
    };
    fetchData();
  }, [form]);

  const generateCaseCode = (prefix = "CASE") => `${prefix}-${Date.now()}`;

  const handleServiceChange = async (serviceId) => {
    try {
      const serviceDetail = await apiService.staff.getServiceDetail(serviceId);
      if (serviceDetail.participantTypes) {
        setParticipants(serviceDetail.participantTypes.map((type) => ({
          type,
          name: '',
          gender: '',
          citizenId: '',
          address: '',
          birthDate: ''
        })));
      }
    } catch (e) {
      setParticipants([]);
    }
  };

  const handleSubmit = async (values) => {
    try {
      // Validate participants
      for (const p of participants) {
        if (!p.name || !p.gender || !p.citizenId || !p.address || !p.birthDate) {
          message.error('Vui lòng nhập đầy đủ thông tin tất cả người tham gia');
          return;
        }
        if (!/^\d{12}$/.test(p.citizenId)) {
          message.error('CCCD phải có 12 số');
          return;
        }
      }
      const payload = {
        appointment: {
          ...values,
        },
        caseFile: {
          userId: values.userId,
          serviceId: values.serviceId,
          caseCode: generateCaseCode(),
          caseType: values.appointmentType,
          status: 'ARCHIVED'
        },
        participants
      };
      const response = await apiService.staff.createAppointment(payload);
      const appointmentId = response?.appointmentId || response?.data?.appointmentId;
      if (!appointmentId) {
        message.error('Không lấy được mã lịch hẹn sau khi tạo!');
        return;
      }
      message.success('Đặt lịch thành công!');
      setTimeout(() => navigate(`/payment/${appointmentId}`), 1200);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Đặt lịch thất bại!';
      message.error(msg);
    }
  };

  return (
    <div className="create-appointment-container">
      <Title level={3}>+ Tạo lịch hẹn mới</Title>
      <Form form={form} layout="vertical" onFinish={handleSubmit} className="create-appointment-form">
        <Form.Item label="Mã nhân viên" name="userId">
          <Input readOnly style={{ background: '#f0f0f0' }} />
        </Form.Item>
        <Form.Item label="Dịch vụ" name="serviceId" rules={[{ required: true, message: 'Chọn dịch vụ' }]}>
          <Select onChange={handleServiceChange} placeholder="--Chọn dịch vụ--">
            {services.map(s => <Option key={s.serviceId} value={s.serviceId}>{s.serviceName}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item label="Loại lịch hẹn" name="appointmentType" rules={[{ required: true, message: 'Chọn loại lịch hẹn' }]}>
          <Select placeholder="--Chọn--">
            {APPOINTMENT_TYPES.map(opt => <Option key={opt.value} value={opt.value}>{opt.label}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item label="Phương thức lấy mẫu" name="deliveryMethod" initialValue="SELF_DROP_OFF">
          <Input readOnly />
        </Form.Item>
        <Form.Item label="Trạng thái lịch hẹn" name="appointmentStatus">
          <Input readOnly />
        </Form.Item>
        <Form.Item label="Trạng thái thu mẫu" name="collectionStatus">
          <Input readOnly />
        </Form.Item>
        <Form.Item label="Ghi chú" name="appointmentNote">
          <Input.TextArea maxLength={255} />
        </Form.Item>

        {participants.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <Title level={5}>Thông tin người tham gia</Title>
            {participants.map((p, idx) => (
              <div key={idx} className="participant-form-row">
                <Input
                  placeholder={`Tên (${p.type})`}
                  value={p.name}
                  onChange={(e) => {
                    const updated = [...participants];
                    updated[idx].name = e.target.value;
                    setParticipants(updated);
                  }}
                  style={{ marginBottom: 8 }}
                />
                <Select
                  placeholder="Giới tính"
                  value={p.gender}
                  onChange={(val) => {
                    const updated = [...participants];
                    updated[idx].gender = val;
                    setParticipants(updated);
                  }}
                  style={{ marginBottom: 8 }}
                >
                  <Option value="MALE">Nam</Option>
                  <Option value="FEMALE">Nữ</Option>
                  <Option value="OTHER">Khác</Option>
                </Select>
                <Input
                  placeholder="CMND/CCCD"
                  value={p.citizenId}
                  maxLength={12}
                  onChange={(e) => {
                    const updated = [...participants];
                    updated[idx].citizenId = e.target.value;
                    setParticipants(updated);
                  }}
                  style={{ marginBottom: 8 }}
                />
                <Input
                  placeholder="Địa chỉ"
                  value={p.address}
                  onChange={(e) => {
                    const updated = [...participants];
                    updated[idx].address = e.target.value;
                    setParticipants(updated);
                  }}
                  style={{ marginBottom: 8 }}
                />
                <Input
                  placeholder="Ngày sinh"
                  type="date"
                  value={p.birthDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    const updated = [...participants];
                    updated[idx].birthDate = e.target.value;
                    setParticipants(updated);
                  }}
                  style={{ marginBottom: 8 }}
                />
              </div>
            ))}
          </div>
        )}

        <Button type="primary" htmlType="submit">Tạo lịch hẹn</Button>
      </Form>
    </div>
  );
}

export default CreateAppointment;
