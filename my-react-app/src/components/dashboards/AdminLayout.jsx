import React from 'react';
import { NavLink, Outlet, Routes, Route } from 'react-router-dom';
import { FaUserCog, FaFlask, FaClipboardList, FaBlog, FaChartBar, FaSignOutAlt, FaHome, FaMapMarkedAlt } from 'react-icons/fa';
import './AdminLayout.css';
import AllowedAreaManager from '../Admin/AllowedAreaManager';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="logo">
          <FaFlask className="logo-icon" />
          <span>ADN System</span>
        </div>
        <nav className="nav-menu">
          <NavLink to="dashboard" activeClassName="active">
            <FaHome /> Tổng quan
          </NavLink>
          <NavLink to="accounts" activeClassName="active">
            <FaUserCog /> Quản lý tài khoản
          </NavLink>
          <NavLink to="services" activeClassName="active">
            <FaClipboardList /> Quản lý dịch vụ
          </NavLink>
          <NavLink to="schedule" activeClassName="active">
            <FaClipboardList /> Lịch làm việc
          </NavLink>
          <NavLink to="areas" activeClassName="active">
            <FaMapMarkedAlt /> Quản lý khu vực
          </NavLink>
          <NavLink to="blogs" activeClassName="active">
            <FaBlog /> Blog & Tin tức
          </NavLink>
          <NavLink to="reports" activeClassName="active">
            <FaChartBar /> Báo cáo & Thống kê
          </NavLink>
          <NavLink to="/logout">
            <FaSignOutAlt /> Đăng xuất
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <header className="admin-header">
          <h1>Hệ Thống Quản Lý Xét Nghiệm ADN</h1>
        </header>

        <section className="content-wrapper">
          <Routes>
            <Route path="areas" element={<AllowedAreaManager />} />
            <Route path="*" element={<Outlet />} />
          </Routes>
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
