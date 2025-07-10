// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import './Accounts.css';
import apiService from "../../service/api";

export default function Accounts() {
  const [account, setAccount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [statusImport, setStatusImport] = useState('');

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Tất cả');
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: '',
    role: ''
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus('');
  };

  const handleImportFile = async () => {
    if (!file) {
      setStatusImport('Vui lòng chọn một file excel trước khi import');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatusImport('Đang tải dữ liệu file....');
      const response = await apiService.admin.importFileUser(formData);
      setStatusImport(response.data || 'Import thành công !');
      const updateuser = await apiService.admin.getAllUser();
      setAccount(updateuser);
    } catch (error) {
      console.error('Lỗi khi import', error);
      setStatusImport('Import thất bại: ' + (error.response?.data || error.message));
    }
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      setStatus('Đang tải dữ liệu ......');
      try {
        const response = await apiService.admin.getAllUser();
        setAccount(response);
        setStatus(response.length === 0 ? 'Không có user nào được tạo' : '');
      } catch (error) {
        console.log(error);
        setStatus('Lỗi khi tải dữ liệu người dùng');
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const getRoleClass = (role) => {
    switch (role) {
      case 'ADMIN': return 'role admin';
      case 'MANAGER': return 'role manager';
      case 'STAFF': return 'role staff';
      case 'CUSTOMER': return 'role user';
      default: return 'role user';
    }
  };

  const getFilteredAccounts = () => {
    return account.filter(user => {
      const name = user.name || '';
      const email = user.email || '';
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'Tất cả' || user.role === filterRole;
      return matchesSearch && matchesRole;
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await apiService.admin.deleteUser(id);
        setAccount(account.filter(u => u.user_id !== id));
        alert('Đã xóa người dùng thành công');
      } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
        setStatus('Lỗi khi xóa người dùng');
      }
    }
  };

  const handleOpenModalEdit = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setFormData({
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role
    });
    setValidationErrors({});
    setIsOpenModal(true);
  };

  const handleOpenModalAdd = () => {
    setSelectedUser(null);
    setModalMode('add');
    setFormData({ name: '', email: '', status: 'Active', role: '' });
    setValidationErrors({});
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setFormData({ name: '', email: '', status: '', role: '' });
    setValidationErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = async () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    } else {
      try {
        const exists = await apiService.admin.check_mail(formData.email);
        if (exists) {
          errors.email = 'Email đã tồn tại';
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra email:', error);
      }
    }

    if (!formData.name.trim()) {
      errors.name = 'Tên không được để trống';
    } else if (formData.name.length < 3) {
      errors.name = 'Tên phải có ít nhất 3 ký tự';
    }

    if (!formData.role || formData.role === 'None') {
      errors.role = 'Vui lòng chọn vai trò';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = await validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setLoading(true);

    try {
      if (modalMode === 'add') {
        const newUser = await apiService.admin.createUser(formData);
        setAccount([...account, { ...formData, user_id: newUser.user_id }]);
        alert('Thêm người dùng thành công');
      } else {
        await apiService.admin.updateUser(selectedUser.user_id, {
          user_id: selectedUser.user_id,
          ...formData
        });
        setAccount(account.map(u =>
          u.user_id === selectedUser.user_id ? { ...u, ...formData } : u
        ));
        alert('Cập nhật người dùng thành công');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Lỗi khi lưu người dùng:', error);
      if (error.response && error.response.status === 403) {
        alert('Bạn không có quyền thực hiện thao tác này');
        handleCloseModal();
      } else {
        setStatus('Lỗi khi lưu người dùng');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page">
      <div className="main-content">
        <div className="topbar">
          <div className="title">Quản lý người dùng</div>
          <button className="add-btn" onClick={handleOpenModalAdd}>+ Thêm người dùng</button>
        </div>

        <div className="filters">
          <input type="text" placeholder="Tìm kiếm người dùng..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="Tất cả">Tất cả vai trò</option>
            <option value="CUSTOMER">Khách hàng</option>
            <option value="STAFF">Nhân viên</option>
            <option value="MANAGER">Quản lý</option>
            <option value="ADMIN">Quản trị viên</option>
          </select>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
          <button onClick={handleImportFile} style={{ marginTop: '1rem' }}>Import</button>
          {statusImport && (
            <p style={{ marginTop: '1rem', color: statusImport.includes('thất bại') ? 'red' : 'green' }}>{statusImport}</p>
          )}
        </div>

        {status && <div className="status-message">{status}</div>}

        {!loading && !status && (
          <table className="user-table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredAccounts().map((u, index) => (
                <tr key={index}>
                  <td>
                    <div className="avatar">{u.name ? u.name[0] : '?'}</div>
                    <div>
                      <div>{u.name}</div>
                      <div className="email">{u.email}</div>
                    </div>
                  </td>
                  <td><span className={getRoleClass(u.role)}>{u.role}</span></td>
                  <td><span className="status active">{u.status}</span></td>
                  <td>
                    <button className="action edit" onClick={() => handleOpenModalEdit(u)}>✏️</button>
                    <button className="action delete" onClick={() => handleDelete(u.user_id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isOpenModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{modalMode === 'add' ? 'Thêm người dùng' : 'Chỉnh sửa người dùng'}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Họ và tên:
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
                {validationErrors.name && <div className="error">{validationErrors.name}</div>}
              </label>
              <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                {validationErrors.email && <div className="error">{validationErrors.email}</div>}
              </label>
              <label>
                Trạng thái:
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>
              <label>
                Vai trò:
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option>None</option>
                  <option value="STAFF">Nhân viên</option>
                  <option value="MANAGER">Quản lý</option>
                  <option value="CUSTOMER">Khách hàng</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {validationErrors.role && <div className="error">{validationErrors.role}</div>}
              </label>
              <button type="submit" disabled={loading}>{loading ? 'Đang xử lý...' : 'Lưu'}</button>
              <button type="button" onClick={handleCloseModal}>Thoát</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
