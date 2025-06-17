import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingInfo = location.state?.bookingInfo;

  const [method, setMethod] = useState('cash');
  const [paid, setPaid] = useState(false);

  if (!bookingInfo) {
    return (
      <div className="payment-container">
        <h2>Thanh toán</h2>
        <p>Không có thông tin đặt lịch. Vui lòng đặt lịch trước.</p>
        <button onClick={() => navigate('/booking')}>Đặt lịch</button>
      </div>
    );
  }

  const handlePay = (e) => {
    e.preventDefault();
    setPaid(true);
  };

  return (
    <div className="payment-container">
      <h2>Thanh toán dịch vụ</h2>
      {!paid ? (
        <form className="payment-form" onSubmit={handlePay}>
          <div className="form-group">
            <label>Họ và tên:</label>
            <input type="text" value={bookingInfo.name} disabled />
          </div>
          <div className="form-group">
            <label>Dịch vụ:</label>
            <input type="text" value={bookingInfo.service} disabled />
          </div>
          <div className="form-group">
            <label>Ngày hẹn:</label>
            <input type="text" value={bookingInfo.date} disabled />
          </div>
          <div className="form-group">
            <label>Số điện thoại:</label>
            <input type="text" value={bookingInfo.phone} disabled />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="text" value={bookingInfo.email} disabled />
          </div>
          <div className="form-group">
            <label>Chọn phương thức thanh toán:</label>
            <select value={method} onChange={e => setMethod(e.target.value)}>
              <option value="cash">Tiền mặt</option>
              <option value="momo">MoMo</option>
            </select>
          </div>
          <button type="submit">Thanh toán</button>
        </form>
      ) : (
        <div className="invoice">
          <h3>Hóa đơn thanh toán</h3>
          <p><strong>Khách hàng:</strong> {bookingInfo.name}</p>
          <p><strong>Dịch vụ:</strong> {bookingInfo.service}</p>
          <p><strong>Ngày hẹn:</strong> {bookingInfo.date}</p>
          <p><strong>Số điện thoại:</strong> {bookingInfo.phone}</p>
          <p><strong>Email:</strong> {bookingInfo.email}</p>
          <p><strong>Phương thức:</strong> {method === 'cash' ? 'Tiền mặt' : 'MoMo'}</p>
          {method === 'momo' && (
            <div className="momo-box">
              <img src="https://static.mservice.io/img/logo-momo.png" alt="MoMo" width={80} />
              <p>Vui lòng mở ứng dụng MoMo và quét mã QR để thanh toán.</p>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MoMoThanhToan" alt="QR MoMo" />
            </div>
          )}
          {method === 'cash' && (
            <div className="cash-box">
              <p>Vui lòng thanh toán trực tiếp tại quầy.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Payment;