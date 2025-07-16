import React, { useEffect, useState } from 'react';
import './UserDashboard.css';
import { useNavigate } from 'react-router-dom';
import apiService from '../../service/api';

// Component hiển thị 1 dòng thông tin
function UserInfoField({ label, value }) {
  return (
    <p>
      <strong>{label}:</strong> {value || '—'}
    </p>
  );
}

// Component badge vai trò
function RoleBadge({ role }) {
  const colorMap = {
    ADMIN: '#e74c3c',
    MANAGER: '#3498db',
    STAFF: '#f39c12',
    CUSTOMER: '#27ae60',
    GUEST: '#95a5a6',
  };
  return (
    <span
      style={{
        backgroundColor: colorMap[role?.toUpperCase()] || '#aaa',
        color: '#fff',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '13px',
        marginLeft: '6px',
      }}
    >
      {role}
    </span>
  );
}

function UserDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    avatar: '?',
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    gender: '',
    indentifiCard: '',
    role: '',
  });
  const [editData, setEditData] = useState(null);
  const [status, setStatus] = useState('');
  const [editing, setEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStatus, setPasswordStatus] = useState('');


  useEffect(() => {
    const fetchProfile = async () => {
      setStatus('Đang tải dữ liệu ...');
      try {
        const response = await apiService.user.getProfile();
        console.log(response)

        setUser(response);
        setStatus('');
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng', error);
        setStatus('Lỗi khi tải dữ liệu người dùng');
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEditData(user);
    setEditing(true);
    setStatus('');
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editData.name?.trim()) return setStatus('Vui lòng nhập họ tên');
    if (!editData.email?.trim()) return setStatus('Vui lòng nhập email');

    setStatus('Đang cập nhật ...');
    try {
      const response = await apiService.user.updateProfile(editData);
      setUser(response);
      setEditing(false);
      setStatus('Cập nhật thành công');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      const msg = error.response?.data?.message || 'Lỗi không xác định';
      setStatus(`Cập nhật thất bại: ${msg}`);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData(user);
    setStatus('');
  };

  const renderViewMode = () => (
    <>
      <h2>
        {user.name}
        <RoleBadge role={user.role} />
      </h2>
      <UserInfoField label="Email" value={user.email} />
      <UserInfoField label="Điện thoại" value={user.phone} />
      <UserInfoField label="Ngày sinh" value={user.birthDate} />
      <UserInfoField label="Địa chỉ" value={user.address} />
      <UserInfoField label="Giới tính" value={user.gender} />
      <UserInfoField label="CCCD" value={user.indentifiCard} />
    </>
  );

  

  const renderEditMode = () => (
    <form onSubmit={handleSave} className="form-grid">
      <input type="text" name="name" value={editData.name || ''} onChange={handleChange} className="profile-input" placeholder="Họ và tên *" required />
      <input type="email" name="email" value={editData.email || ''} onChange={handleChange} className="profile-input" placeholder="Email *" required />
      <input type="text" name="phone" value={editData.phone || ''} onChange={handleChange} className="profile-input" placeholder="Số điện thoại" />
      <input type="date" name="birthDate" value={editData.birthDate || ''} onChange={handleChange} className="profile-input" />
      <input type="text" name="address" value={editData.address || ''} onChange={handleChange} className="profile-input" placeholder="Địa chỉ" />
      <select name="gender" value={editData.gender || ''} onChange={handleChange} className="profile-input">
        <option value="">-- Giới tính --</option>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
        <option value="Khác">Khác</option>
      </select>
      <input type="text" name="indentifiCard" value={editData.indentifiCard || ''} onChange={handleChange} className="profile-input" placeholder="CCCD" pattern="[0-9]{12}" title="CCCD phải có 12 chữ số" />
      <div className="user-profile-actions">
        <button type="submit" disabled={status === 'Đang cập nhật ...'}>
          {status === 'Đang cập nhật ...' ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button type="button" onClick={handleCancel}>Hủy</button>
      </div>
    </form>
  );
  const handlePasswordChange = (e) => {
  setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
};

const handleChangePassword = async (e) => {
  e.preventDefault();

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    setPasswordStatus('Mật khẩu mới và xác nhận không khớp');
    return;
  }
  console.log('user.id:', user.userId);

  try {
    setPasswordStatus('Đang xử lý...');
    await apiService.user.changePassword(user.userId, {  // lấy id từ user state
      oldPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
    setPasswordStatus('Đổi mật khẩu thành công');
    setTimeout(() => {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowChangePassword(false);
      setPasswordStatus('');
    }, 2000);
  } catch (error) {
    // Lấy message lỗi backend trả về
  const msg = error.response?.data?.message || error.response?.data || error.message || 'Đổi mật khẩu thất bại';
  setPasswordStatus(msg);
  }
};



  return (
    <div className="user-profile-container">
      {status && (
        <div className={`status-message ${status.includes('thành công') ? 'success' : 'error'}`}>{status}</div>
      )}
      {showChangePassword && (
  <div className="modal-overlay" onClick={() => setShowChangePassword(false)}>
    <div className="modal-content small" onClick={e => e.stopPropagation()}>
      <h3>Đổi mật khẩu</h3>
      <form onSubmit={handleChangePassword}>
        <label>Mật khẩu hiện tại:</label>
        <input
          type="password"
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={handlePasswordChange}
          required
        />
        <label>Mật khẩu mới:</label>
        <input
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
          required
          minLength={6}
        />
        <label>Xác nhận mật khẩu mới:</label>
        <input
          type="password"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={handlePasswordChange}
          required
          minLength={6}
        />
        {passwordStatus && <p className="status-message">{passwordStatus}</p>}
        <div className="modal-actions">
          <button type="submit">Đổi mật khẩu</button>
          <button type="button" onClick={() => setShowChangePassword(false)}>Hủy</button>
        </div>
      </form>
    </div>
  </div>
)}

      <div className="user-profile-card">
        <div className="user-profile-avatar">
          <img src={user.avatar} alt="Avatar" onError={(e) => (e.target.src = '/default-avatar.png')} />
        </div>
        <div className="user-profile-info">
          {editing && editData ? renderEditMode() : renderViewMode()}
        </div>
      </div>
      {!editing && (
        <div className="user-profile-actions">
          <button onClick={handleEdit}>Chỉnh sửa thông tin</button>
          <button onClick={() => setShowChangePassword(true)}>Đổi mật khẩu</button>
          <button className="logout-btn">Đăng xuất</button>
          <button className="back-btn" onClick={() => navigate(-1)}>Quay về</button>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
