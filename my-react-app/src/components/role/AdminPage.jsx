import React from 'react';
import './AdminPage.css';
import { useNavigate } from 'react-router-dom';

import apiService from "../../service/api";



function AdminPage() {
  const navigate = useNavigate();



  return (
    <div className="admin-page">
      <h2>👨‍💻 Quản Trị Hệ Thống</h2>
      <div className="admin-section">
        <h3>Quản lý tài khoản</h3>
        <button
          className="admin-btn"
          onClick={() => navigate('/admin-dashboard')}
        >
          Phân quyền tài khoản
        </button>        <button className="admin-btn">Thêm tài khoản mới</button>
        <button className="admin-btn">Danh sách tài khoản</button>
      </div>
      <div className="admin-section">
        <h3>Quản lý dịch vụ</h3>
        <button className="admin-btn">Thêm dịch vụ</button>
        <button className="admin-btn">Cập nhật giá dịch vụ</button>
        <button className="admin-btn">Danh sách dịch vụ</button>
      </div>
      <div className="admin-section">
        <h3>Báo cáo & Thống kê</h3>
        <button className="admin-btn">Xem báo cáo tổng quan</button>
        <button className="admin-btn">Xuất báo cáo PDF</button>
        <button className="admin-btn">Xuất báo cáo Excel</button>
      </div>
    </div>
  );
}

export default AdminPage;