import React, { useState } from 'react';
import './UserDashboard.css';

function UserDashboard() {
  // Dữ liệu mẫu
  const [user, setUser] = useState({
    avatar: '/images/avatar-default.png',
    name: 'Nguyễn Văn A',
    email: 'user@gmail.com',
    phone: '0339 773 330',
    dob: '1995-05-20',
    address: '388 đường 81, phường Tân Quy, quận 7, TP. Hồ Chí Minh',
    gender: 'Nam',
    cccd: '012345678901',
    role: 'Người dùng',
    joined: '2023-01-15',
  });

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(user);

  const handleEdit = () => {
    setEditData(user);
    setEditing(true);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUser(editData);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        <div className="user-profile-avatar">
          <img src={user.avatar} alt="Avatar" />
        </div>
        <div className="user-profile-info">
          {editing ? (
            <form onSubmit={handleSave}>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                className="profile-input"
                placeholder="Họ và tên"
              />
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                className="profile-input"
                placeholder="Email"
              />
              <input
                type="text"
                name="phone"
                value={editData.phone}
                onChange={handleChange}
                className="profile-input"
                placeholder="Số điện thoại"
              />
              <input
                type="date"
                name="dob"
                value={editData.dob}
                onChange={handleChange}
                className="profile-input"
                placeholder="Ngày sinh"
              />
              <input
                type="text"
                name="address"
                value={editData.address}
                onChange={handleChange}
                className="profile-input"
                placeholder="Địa chỉ"
              />
              <select
                name="gender"
                value={editData.gender}
                onChange={handleChange}
                className="profile-input"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
              <input
                type="text"
                name="cccd"
                value={editData.cccd}
                onChange={handleChange}
                className="profile-input"
                placeholder="Căn cước công dân"
              />
              <div className="user-profile-actions">
                <button type="submit">Lưu</button>
                <button type="button" onClick={handleCancel}>Hủy</button>
              </div>
            </form>
          ) : (
            <>
              <h2>{user.name}</h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Số điện thoại:</strong> {user.phone}</p>
              <p><strong>Ngày sinh:</strong> {user.dob}</p>
              <p><strong>Địa chỉ:</strong> {user.address}</p>
              <p><strong>Giới tính:</strong> {user.gender}</p>
              <p><strong>Căn cước công dân:</strong> {user.cccd}</p>
              <p><strong>Vai trò:</strong> {user.role}</p>
              <p><strong>Ngày đăng ký:</strong> {user.joined}</p>
            </>
          )}
        </div>
      </div>
      {!editing && (
        <div className="user-profile-actions">
          <button onClick={handleEdit}>Chỉnh sửa thông tin</button>
          <button>Đổi mật khẩu</button>
          <button className="logout-btn">Đăng xuất</button>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;