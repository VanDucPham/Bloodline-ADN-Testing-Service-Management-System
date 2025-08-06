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

      <h2>+ Tạo phiếu xét nghiệm ADN</h2>
      <form onSubmit={handleSubmit} className="create-appointment-form">
        {/* Hiển thị userId, chỉ đọc */}
        <div>
          <label>Mã nhân viên (userId):</label>
          <input
            type="text"
            name="userId"
            value={form.userId || ''}
            readOnly
            style={{ background: '#f0f0f0' }}
          />
        </div>
        <div>
          <label>Dịch vụ:</label>
          <select name="serviceId" value={form.serviceId} onChange={handleChange} required>
            <option value="">--Chọn dịch vụ--</option>
            {services.map(s => (
              //Sẽ hiển thị cho người dùng chọn tên service nhưng lưu về lại là id
              <option key={s.serviceId} value={s.serviceId}>{s.serviceName}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Loại dịch vụ:</label>
          <select name="appointmentType" value={form.appointmentType} onChange={handleChange} required>
            <option value="">--Chọn--</option>
            {APPOINTMENT_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        {/* Loại hồ sơ sẽ tự động đồng bộ với loại lịch hẹn, không cho chọn riêng */}
        {/* <div>
          <label></label>
          <input type="hidden" value={caseFile.caseType ? (APPOINTMENT_TYPES.find(t => t.value === caseFile.caseType)?.label || caseFile.caseType) : ''} readOnly style={{ background: '#f0f0f0' }} />
        </div> */}
        {/* <div>
          <label>Ngày hẹn:</label>
          <input type="date" name="appointmentDate" value={form.appointmentDate} onChange={handleChange} required />
        </div>
        <div>
          <label>Giờ hẹn:</label>
          <input type="time" name="appointmentTime" value={form.appointmentTime} onChange={handleChange} required />
        </div> */}
        {/* <div>
          <label></label>
          <input type="hidden" value="Đến cơ sở lấy mẫu cơ sở" readOnly />
        </div>

        <div>
          <label></label>

           <input type="hidden" value="Đã đặt" readOnly />


        </div>
        <div>
          <label></label>

           <input type="hidden" value="Đã phân công" readOnly />
        </div> */}

        <div>
          <label>Ghi chú:</label>
          <input name="appointmentNote" value={form.appointmentNote} onChange={handleChange} />
        </div>
        <button type="submit">Tạo phiếu xét nghiệm</button>
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
      </form>

    </div>
  );
}

export default CreateAppointment;
