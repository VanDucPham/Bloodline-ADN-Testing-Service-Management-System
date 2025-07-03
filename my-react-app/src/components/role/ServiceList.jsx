import React, { useEffect, useState } from 'react';
import apiService from '../../service/api';
import './AdminPage.css';

function ServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ serviceName: '', servicePrice: '', serviceDescription: '' });
  const [addMsg, setAddMsg] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ serviceName: '', servicePrice: '', serviceDescription: '' });
  const [editMsg, setEditMsg] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiService.admin.getAllService();
      setServices(Array.isArray(res) ? res : []);
    } catch (e) {
      setError('Không thể tải danh sách dịch vụ.');
    }
    setLoading(false);
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Bạn có chắc muốn xóa dịch vụ này? Nếu xóa sẽ mất dữ liệu')) return;
    try {
      await apiService.admin.deleteService(serviceId);
      setDeleteMsg('Xóa thành công!');
      fetchServices();
    } catch (e) {
      setDeleteMsg('Xóa dịch vụ thất bại.');
    }
    setTimeout(() => setDeleteMsg(''), 1500);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAddMsg('');
    try {
      await apiService.admin.createService(addForm);
      setAddMsg('Thêm dịch vụ thành công!');
      setAddForm({ serviceName: '', servicePrice: '', serviceDescription: '' });
      fetchServices();
    } catch (e) {
      setAddMsg('Thêm dịch vụ thất bại!');
    }
    setTimeout(() => setAddMsg(''), 1500);
  };

  const handleEditClick = (service) => {
    setEditId(service.serviceId);
    setEditForm({
      serviceName: service.serviceName,
      servicePrice: service.servicePrice,
      serviceDescription: service.serviceDescription || ''
    });
    setEditMsg('');
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (serviceId) => {
    setEditMsg('');
    try {
      await apiService.admin.updateService(serviceId, editForm);
      setEditMsg('Cập nhật thành công!');
      setEditId(null);
      fetchServices();
    } catch (e) {
      setEditMsg('Cập nhật thất bại!');
    }
    setTimeout(() => setEditMsg(''), 1500);
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditMsg('');
  };

  return (
    <div className="admin-page">
      <h2>Danh sách dịch vụ</h2>
      <button className="admin-btn" onClick={() => setShowAdd(v => !v)}>
        {showAdd ? 'Đóng form thêm dịch vụ' : '+ Thêm dịch vụ'}
      </button>
      {showAdd && (
        <form className="admin-form" onSubmit={handleAdd} style={{marginTop: 12, marginBottom: 12, background: '#f8fafd', padding: 16, borderRadius: 8}}>
          <div style={{marginBottom: 8}}>
            <label style={{marginRight: 8}}>Tên dịch vụ:</label>
            <input name="serviceName" value={addForm.serviceName} onChange={e => setAddForm(f => ({...f, serviceName: e.target.value}))} required />
          </div>
          <div style={{marginBottom: 8}}>
            <label style={{marginRight: 8}}>Giá:</label>
            <input name="servicePrice" type="number" value={addForm.servicePrice} onChange={e => setAddForm(f => ({...f, servicePrice: e.target.value}))} required />
          </div>
          <div style={{marginBottom: 8}}>
            <label style={{marginRight: 8}}>Mô tả:</label>
            <input name="serviceDescription" value={addForm.serviceDescription} onChange={e => setAddForm(f => ({...f, serviceDescription: e.target.value}))} />
          </div>
          <button className="admin-btn" type="submit">Thêm dịch vụ</button>
          {addMsg && <p style={{marginTop: 8}}>{addMsg}</p>}
        </form>
      )}
      {loading ? <p>Đang tải...</p> : error ? <p className="error-msg">{error}</p> : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã dịch vụ</th>
              <th>Tên dịch vụ</th>
              <th>Giá</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.serviceId}>
                <td>{s.serviceId}</td>
                {editId === s.serviceId ? (
                  <>
                    <td><input name="serviceName" value={editForm.serviceName} onChange={handleEditChange} /></td>
                    <td><input name="servicePrice" type="number" value={editForm.servicePrice} onChange={handleEditChange} /></td>
                    <td><input name="serviceDescription" value={editForm.serviceDescription} onChange={handleEditChange} /></td>
                    <td>
                      <button className="admin-btn" onClick={() => handleEditSave(s.serviceId)}>Lưu</button>
                      <button className="admin-btn" onClick={handleEditCancel}>Hủy</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{s.serviceName}</td>
                    <td>{s.servicePrice}</td>
                    <td>{s.serviceDescription || 'Không có mô tả'}</td>
                    <td>
                      <button className="admin-btn" onClick={() => handleEditClick(s)}>Sửa</button>
                      <button className="admin-btn" onClick={() => handleDelete(s.serviceId)}>Xóa</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {deleteMsg && <p style={{marginTop: 8}}>{deleteMsg}</p>}
      {editMsg && <p style={{marginTop: 8}}>{editMsg}</p>}
    </div>
  );
}

export default ServiceList;
