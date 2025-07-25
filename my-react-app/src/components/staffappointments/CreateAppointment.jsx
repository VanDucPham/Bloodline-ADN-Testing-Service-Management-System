import React, { useState, useEffect } from 'react';
import apiService from '../../service/api';
import { useNavigate } from 'react-router-dom';
import './CreateAppointment.css';

const APPOINTMENT_TYPES = [
  { value: 'ADMINISTRATIVE', label: 'Hành chính' },
  { value: 'CIVIL', label: 'Dân sự' },
];
const DELIVERY_METHODS = [
  { value: 'SELF_DROP_OFF', label: 'Đến cơ sở lấy mẫu cơ sở' },
];
const STATUS_OPTIONS = [
  { value: 'SCHEDULED', label: 'Đã đặt' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'IN_PROGRESS', label: 'Đang xử lý' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

const COLLECTION_STATUS_OPTIONS = [
  { value: 'ASSIGNED', label: 'Đã phân công' },
  { value: 'TRAVELING', label: 'Đang di chuyển' },
  { value: 'ARRIVED', label: 'Đã đến nơi' },
  { value: 'COLLECTING', label: 'Đang thu mẫu' },
  { value: 'COMPLETED', label: 'Hoàn thành thu mẫu' },
];

function CreateAppointment() {
  const [form, setForm] = useState({
    userId: '',
    serviceId: '',
    appointmentType: '',
    // appointmentDate: '',
    // appointmentTime: '',
    deliveryMethod: '',
    appointmentStatus: 'SCHEDULED',
    collectionStatus: 'ASSIGNED',
    appointmentNote: '',
  });
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [staffInfo, setStaffInfo] = useState(null);
  const [createdAppointmentId, setCreatedAppointmentId] = useState(null);
  const navigate = useNavigate();
  const [caseFile, setCaseFile] = useState({
    userId: '',
    caseCode: '',
    caseType: '',
    serviceId: '',
    status: 'ARCHIVED',
  });


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await apiService.staff.getAllServices();
        setServices(res);
      } catch (e) {
        setServices([]);
      }
    };
    fetchServices();
    // Lấy profile staff
    const fetchStaffProfile = async () => {
      try {
        const res = await apiService.staff.getStaffProfile();
        console.log('Staff profile:', res);
        setStaffInfo(res);
        setForm(f => ({ ...f, userId: res.userId })); //tự động lấy userId
        setCaseFile(cf => ({ ...cf, userId: res.userId })); // Đảm bảo caseFile cũng có userId
      } catch (e) {
        setStaffInfo(null);
      }
    };
    fetchStaffProfile();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'serviceId') {
      setCaseFile(cf => ({ ...cf, serviceId: e.target.value }));
    }
    if (e.target.name === 'appointmentType') {
      setCaseFile(cf => ({ ...cf, caseType: e.target.value })); // Đồng bộ loại hồ sơ
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Validate FE trước khi gửi lên BE
    // const today = new Date();
    // const selectedDate = new Date(form.appointmentDate);
    // if (!form.appointmentDate) {
    //   setError('Vui lòng chọn ngày hẹn!');
    //   return;
    // }
    // if (selectedDate <= today) {
    //   setError('Lịch hẹn phải được đặt trước ít nhất 1 ngày!');
    //   return;
    // }
    if (form.appointmentType === 'ADMINISTRATIVE' && form.deliveryMethod === 'HOME_COLLECTION') {
      setError('Hành chính chỉ được chọn dịch vụ tại cơ sở!');
      return;
    }
    try {
      const response = await apiService.staff.createAppointment({
        appointment: form,
        caseFile: caseFile
      });
      const appointmentId = response?.appointmentId || response?.data?.appointmentId;
      if (!appointmentId) {
        setError('Không lấy được mã lịch hẹn sau khi tạo!');
        return;
      }
      setSuccess('Đặt lịch thành công!');
      setTimeout(() => navigate(`/payment/${appointmentId}`), 1200);
    } catch (err) {
      // Nếu backend trả về lỗi khung giờ đã đầy thì hiển thị đúng thông báo
      //GlobalExceptionHandler class này đã xử lí
      const msg = err?.response?.data?.message || err?.message;
      if (msg && (msg.includes('Khung giờ đã đầy') || msg.includes('khung giờ đã đầy'))) {
        setError('Khung giờ đã đầy. Vui lòng chọn khung giờ khác.');
      } else {
        setError(msg || 'Đặt lịch thất bại!');
      }
    }
  };

  return (
    <div className="create-appointment-container">
      <h2>+ Tạo lịch hẹn mới</h2>
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
          <label>Loại lịch hẹn:</label>
          <select name="appointmentType" value={form.appointmentType} onChange={handleChange} required>
            <option value="">--Chọn--</option>
            {APPOINTMENT_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        {/* Loại hồ sơ sẽ tự động đồng bộ với loại lịch hẹn, không cho chọn riêng */}
        <div>
          <label>Loại hồ sơ:</label>
          <input type="text" value={caseFile.caseType ? (APPOINTMENT_TYPES.find(t => t.value === caseFile.caseType)?.label || caseFile.caseType) : ''} readOnly style={{ background: '#f0f0f0' }} />
        </div>
        {/* <div>
          <label>Ngày hẹn:</label>
          <input type="date" name="appointmentDate" value={form.appointmentDate} onChange={handleChange} required />
        </div>
        <div>
          <label>Giờ hẹn:</label>
          <input type="time" name="appointmentTime" value={form.appointmentTime} onChange={handleChange} required />
        </div> */}
        <div>
          <label>Phương thức lấy mẫu:</label>
          <input type="text" value="Đến cơ sở lấy mẫu cơ sở" readOnly />
        </div>

        <div>
          <label>Trạng thái lịch hẹn:</label>

           <input type="text" value="Đã đặt" readOnly />


        </div>
        <div>
          <label>Trạng thái thu mẫu:</label>

           <input type="text" value="Đã phân công" readOnly />
        </div>

        <div>
          <label>Ghi chú:</label>
          <input name="appointmentNote" value={form.appointmentNote} onChange={handleChange} />
        </div>
        <button type="submit">Tạo lịch hẹn</button>
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
      </form>
    </div>
  );
}

export default CreateAppointment;
