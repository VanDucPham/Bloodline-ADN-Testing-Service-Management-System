import React, { useState } from 'react';
import apiService from '../service/api';
import axios from 'axios';

const ConsultationStatus = () => {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập số điện thoại' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Sử dụng axios trực tiếp để tránh vấn đề baseURL
      const response = await axios.get(`http://localhost:8080/api/consultation/status/${phone.trim()}`);
      
      if (response.data.success) {
        setStatus(response.data.data);
        setMessage({ type: 'success', text: response.data.message });
      } else {
        setMessage({ type: 'error', text: response.data.message });
      }
    } catch (error) {
      console.error('Lỗi kiểm tra trạng thái:', error);
      const errorMessage = error.response?.data?.message || 'Không tìm thấy yêu cầu tư vấn';
      setMessage({ type: 'error', text: errorMessage });
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'NEW':
        return 'Mới tạo';
      case 'IN_PROGRESS':
        return 'Đang xử lý';
      case 'RESOLVED':
        return 'Đã hoàn thành';
      case 'CLOSED':
        return 'Đã đóng';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW':
        return '#1890ff';
      case 'IN_PROGRESS':
        return '#faad14';
      case 'RESOLVED':
        return '#52c41a';
      case 'CLOSED':
        return '#d9d9d9';
      default:
        return '#666';
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#1890ff' }}>
        Kiểm Tra Trạng Thái Tư Vấn
      </h2>

      {/* Message Display */}
      {message.text && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          textAlign: 'center'
        }}>
          {message.type === 'success' && (
            <div style={{ color: '#52c41a', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
              ✅ {message.text}
            </div>
          )}
          {message.type === 'error' && (
            <div style={{ color: '#ff4d4f', backgroundColor: '#fff2f0', border: '1px solid #ffccc7' }}>
              ❌ {message.text}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleCheckStatus}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Số điện thoại đã đăng ký:
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại đã đăng ký"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              fontSize: '16px'
            }}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 24px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'ĐANG KIỂM TRA...' : 'KIỂM TRA TRẠNG THÁI'}
        </button>
      </form>

      {/* Status Display */}
      {status && (
        <div style={{ marginTop: '24px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '16px', color: '#333' }}>Thông Tin Yêu Cầu Tư Vấn</h3>
          
          <div style={{ marginBottom: '12px' }}>
            <strong>Họ tên:</strong> {status.customerName}
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <strong>Số điện thoại:</strong> {status.phone}
          </div>
          
          {status.email && (
            <div style={{ marginBottom: '12px' }}>
              <strong>Email:</strong> {status.email}
            </div>
          )}
          
          <div style={{ marginBottom: '12px' }}>
            <strong>Nội dung:</strong> {status.content}
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <strong>Ngày đăng ký:</strong> {status.createdAt}
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <strong>Trạng thái:</strong>
            <span style={{
              color: getStatusColor(status.status),
              fontWeight: '600',
              marginLeft: '8px',
              padding: '4px 12px',
              backgroundColor: getStatusColor(status.status) + '20',
              borderRadius: '4px'
            }}>
              {getStatusText(status.status)}
            </span>
          </div>
          
          {status.handledBy && (
            <div style={{ marginBottom: '12px' }}>
              <strong>Nhân viên xử lý:</strong> {status.handledBy}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsultationStatus; 