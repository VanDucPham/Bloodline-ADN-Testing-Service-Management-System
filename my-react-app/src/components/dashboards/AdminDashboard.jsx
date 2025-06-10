import React from 'react';
import './AdminDashboard.css';

const users = [
  { name: 'Nguyễn Văn Anh', email: 'user@example.com', role: 'Người dùng', status: 'Hoạt động', createdAt: '2024-01-15' },
  { name: 'Trần Thị Bình', email: 'staff@example.com', role: 'Nhân viên', status: 'Hoạt động', createdAt: '2024-01-15' },
  { name: 'Lê Văn Cường', email: 'manager@example.com', role: 'Quản lý', status: 'Hoạt động', createdAt: '2024-01-15' },
  { name: 'Phạm Thị Dung', email: 'admin@example.com', role: 'Quản trị viên', status: 'Hoạt động', createdAt: '2024-01-15' }
];

const getRoleClass = (role) => {
  switch (role) {
    case 'Người dùng':
      return 'role user';
    case 'Nhân viên':
      return 'role staff';
    case 'Quản lý':
      return 'role manager';
    case 'Quản trị viên':
      return 'role admin';
    default:
      return 'role';
  }
};

export default function AdminDashboard() {
  return (
    <div className="container">
      <aside className="sidebar">
        <h2>Admin</h2>
        <a class="back" href="/">Quay về</a>
        <ul>
          <li>🏠 Trang chủ</li>
          <li className="active">👤 Quản lý người dùng</li>
          <li>🔐 Phân quyền</li>
          <li>🛠️ Quản lý dịch vụ</li>
          <li>📊 Thống kê tổng quan</li>
          <li>⚙️ Quản trị hệ thống</li>
        </ul>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div className="title">Quản lý người dùng</div>
          <button className="add-btn">+ Thêm người dùng</button>
        </div>

        <div className="filters">
          <input type="text" placeholder="Tìm kiếm người dùng..." />
          <select>
            <option>Tất cả vai trò</option>
            <option>Người dùng</option>
            <option>Nhân viên</option>
            <option>Quản lý</option>
            <option>Quản trị viên</option>
          </select>
          <button>📂 Lọc</button>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={index}>
                <td>
                  <div className="avatar">{u.name[0]}</div>
                  <div>
                    <div>{u.name}</div>
                    <div className="email">{u.email}</div>
                  </div>
                </td>
                <td><span className={getRoleClass(u.role)}>{u.role}</span></td>
                <td><span className="status active">{u.status}</span></td>
                <td>{u.createdAt}</td>
                <td>
                  <button className="action edit">✏️</button>
                  <button className="action delete">🗑️</button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
