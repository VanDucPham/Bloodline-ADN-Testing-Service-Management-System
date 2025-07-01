import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Booking.css';

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    serviceEntity: location.state?.serviceEntity || '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      navigate('/payment', { state: { bookingInfo: form } });
    }, 1200); // Hiển thị thông báo thành công 1.2s rồi chuyển trang
  };

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h2>Đặt lịch hẹn</h2>
      </div>
      <div className="bookings-back-link">
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            navigate(-1);
          }}
          style={{ cursor: 'pointer', color: '#2d7a7a', textDecoration: 'underline' }}
        >
          Quay lại
        </a>
      </div>

      {success && (
        <div className="bookings-success">
          Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.
        </div>
      )}

      <form className="bookings-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="serviceEntity">Loại dịch vụ:</label>
          <input
            type="text"
            id="serviceEntity"
            name="serviceEntity"
            value={form.serviceEntity}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Họ và tên:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Số điện thoại:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Ngày hẹn:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={success}>Đặt lịch</button>
      </form>
    </div>
  );
}

export default Booking;