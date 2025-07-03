import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../../service/api';
import './AdminPage.css';

function ServiceForm() {
  const { serviceId } = useParams();
  const isEdit = Boolean(serviceId);
  const [form, setForm] = useState({ serviceName: '', price: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      apiService.admin.getServiceById(serviceId).then(res => {
        setForm({ serviceName: res.serviceName, price: res.price });
      }).catch(() => setError('Không tìm thấy dịch vụ.'));
    }
  }, [isEdit, serviceId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.serviceName || !form.price) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    try {
      if (isEdit) {
        await apiService.admin.updateService(serviceId, form);
        setSuccess('Cập nhật thành công!');
      } else {
        await apiService.admin.addService(form);
        setSuccess('Thêm dịch vụ thành công!');
        setForm({ serviceName: '', price: '' });
      }
      setTimeout(() => navigate('/admin/service/list'), 1000);
    } catch (e) {
      setError('Lưu dịch vụ thất bại.');
    }
  };

  return (
    <div className="admin-page">
      <h2>{isEdit ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div>
          <label>Tên dịch vụ:</label>
          <input name="serviceName" value={form.serviceName} onChange={handleChange} required />
        </div>
        <div>
          <label>Giá:</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} required />
        </div>
        <button className="admin-btn" type="submit">{isEdit ? 'Cập nhật' : 'Thêm mới'}</button>
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
      </form>
    </div>
  );
}

export default ServiceForm;
