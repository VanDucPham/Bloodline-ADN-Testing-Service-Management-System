// src/pages/StaffManagement.jsx
import React, { useEffect, useState } from 'react';

import apiService from "../../service/api";

export default function ManagerStaff() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'Active',
    role: ''
  });

  // Lấy danh sách nhân viên (STAFF và MANAGER)
  useEffect(() => {
    const fetchStaffs = async () => {
      setStatus('Đang tải dữ liệu ...');
      try {
        const response = await apiService.admin.getAllUser();
        // Lọc ra chỉ những user là STAFF hoặc MANAGER
        const filtered = response.filter(u => u.role === 'STAFF' || u.role === 'MANAGER');
        setStaffs(filtered);
        setStatus(filtered.length === 0 ? 'Không có nhân viên nào' : '');
      } catch (error) {
        setStatus('Lỗi khi tải dữ liệu nhân viên');
      } finally {
        setLoading(false);
      }
    };
    fetchStaffs();
  }, []);

  // Lọc theo tìm kiếm
  const getFilteredStaffs = () => {
    return staffs.filter(staff => {
      const name = staff.name || '';
      const email = staff.email || '';
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await apiService.admin.deleteUser(id);
        setStaffs(staffs.filter(u => u.user_id !== id));
        alert('Đã xóa nhân viên thành công');
      } catch (error) {
        setStatus('Lỗi khi xóa nhân viên');
      }
    }
  };

  const handleOpenModalEdit = (staff) => {
    setSelectedStaff(staff);
    setModalMode('edit');
    setFormData({
      name: staff.name,
      email: staff.email,
      status: staff.status,
      role: staff.role
    });
    setValidationErrors({});
    setIsOpenModal(true);
  };

  const handleOpenModalAdd = () => {
    setSelectedStaff(null);
    setModalMode('add');
    setFormData({ name: '', email: '', status: 'Active', role: '' });
    setValidationErrors({});
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setFormData({ name: '', email: '', status: 'Active', role: '' });
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
        if (exists && (!selectedStaff || formData.email !== selectedStaff.email)) {
          errors.email = 'Email đã tồn tại';
        }
      } catch (error) {}
    }
    if (!formData.name.trim()) {
      errors.name = 'Tên không được để trống';
    } else if (formData.name.length < 3) {
      errors.name = 'Tên phải có ít nhất 3 ký tự';
    }
    if (!formData.role || (formData.role !== 'STAFF' && formData.role !== 'MANAGER')) {
      errors.role = 'Vui lòng chọn vai trò nhân viên';
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
        const newStaff = await apiService.admin.createUser(formData);
        setStaffs([...staffs, { ...formData, user_id: newStaff.user_id }]);
        alert('Thêm nhân viên thành công');
      } else {
        await apiService.admin.updateUser(selectedStaff.user_id, {
          user_id: selectedStaff.user_id,
          ...formData
        });
        setStaffs(staffs.map(u =>
          u.user_id === selectedStaff.user_id ? { ...u, ...formData } : u
        ));
        alert('Cập nhật nhân viên thành công');
      }
      handleCloseModal();
    } catch (error) {
      setStatus('Lỗi khi lưu nhân viên');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page">
      <main className="main-content">
        <div className="topbar">
          <div className="title">Quản lý nhân viên</div>
          <button className="add-btn" onClick={handleOpenModalAdd}>+ Thêm nhân viên</button>
        </div>
        <div className="filters">
          <input type="text" placeholder="Tìm kiếm nhân viên..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        {status && <div className="status-message">{status}</div>}
        {!loading && !status && (
          <table className="user-table">
            <thead>
              <tr>
                <th>Nhân viên</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredStaffs().map((u, index) => (
                <tr key={index}>
                  <td>
                    <div className="avatar">{u.name ? u.name[0] : '?'}</div>
                    <div>
                      <div>{u.name}</div>
                      <div className="email">{u.email}</div>
                    </div>
                  </td>
                  <td><span className={`role ${u.role.toLowerCase()}`}>{u.role}</span></td>
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
      </main>
      {isOpenModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{modalMode === 'add' ? 'Thêm nhân viên' : 'Chỉnh sửa nhân viên'}</h2>
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
                  <option value="">Chọn vai trò</option>
                  <option value="STAFF">Nhân viên</option>
                  <option value="MANAGER">Quản lý</option>
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
