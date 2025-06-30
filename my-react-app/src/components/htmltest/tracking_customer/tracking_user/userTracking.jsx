import React, { useState } from 'react';
import './AppointmentTracking.css'; // Di chuyển CSS vào file riêng

function AppointmentTracking() {

    const [caseUser, setCaseUser] = useState([{
        
    }])
  return (
    <div className="container">
      <h1>Lịch hẹn xét nghiệm ADN của bạn</h1>

      {/* LỊCH HẸN */}
      <div className="appointment-card">
        <div className="card-header">
          <h3>#APT001 - Xét nghiệm cha con</h3>
          <span className="status pending">Đang xử lý</span>
        </div>

        <div className="card-body">
          <p><strong>Ngày hẹn:</strong> 2025-07-03</p>
          <p><strong>Địa điểm:</strong> Trung tâm ADN Hà Nội</p>

          <div className="card-actions">
            <button onClick={() => alert('Xem bản đồ Google Maps')}>📍 Xem bản đồ</button>
            <button onClick={() => alert('Tải lịch hẹn PDF')}>📥 Tải PDF</button>
            <button onClick={() => alert('Tải hồ sơ khách hàng')}>📎 Hồ sơ</button>
            <button onClick={() => window.location.href='feedback.html'}>⭐ Đánh giá</button>
            <a href="feedback.html" className="btn-rating">⭐ Đánh giá</a>
          </div>

          <div className="appointment-details">
            <h4>📋 Chi tiết lịch hẹn</h4>
            <p><strong>Người đặt:</strong> Nguyễn Văn A</p>
            <p><strong>Email:</strong> nguyenvana@gmail.com</p>
            <p><strong>SĐT:</strong> 0912345678</p>
            <p><strong>Thành viên:</strong></p>
            <ul>
              <li>Nguyễn Văn A (Cha)</li>
              <li>Nguyễn Văn B (Con)</li>
            </ul>

            <p><strong>Tiến trình:</strong></p>
            <ul>
              <li>✅ Đã đặt lịch</li>
              <li>✅ Hồ sơ xác nhận</li>
              <li>🔄 Đang xử lý mẫu</li>
              <li>⏳ Chờ kết quả</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2>Tiến trình xử lý hồ sơ</h2>
        <div className="tracker">
          <div className="tracker-step">Đã nhận mẫu</div>
          <div className="tracker-step">Đang phân tích</div>
          <div className="tracker-step">Xác nhận kết quả</div>
          <div className="tracker-step">Hoàn tất</div>
        </div>
      </div>

      <div className="form-section">
        <h2>Kết quả xét nghiệm</h2>
        <div className="summary-box">
          <p><strong>Tình trạng:</strong> Đang chờ kết quả</p>
          <p><strong>File kết quả:</strong> <a href="#">📄 Xem kết quả PDF</a></p>
          <p><strong>Ngày có kết quả dự kiến:</strong> 2025-07-10</p>
        </div>
      </div>
    </div>
  );
}

export default AppointmentTracking;
