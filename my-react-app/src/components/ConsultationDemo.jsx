import React from 'react';
import { Link } from 'react-router-dom';

const ConsultationDemo = () => {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '50px auto',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ textAlign: 'center', color: '#1890ff', marginBottom: '30px' }}>
        Demo Chức Năng Tư Vấn Miễn Phí
      </h1>

      <div style={{ marginBottom: '30px' }}>
        <h3>📋 Hướng Dẫn Test:</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li><strong>Đăng ký tư vấn:</strong> Vào trang chủ và điền form đăng ký tư vấn</li>
          <li><strong>Kiểm tra trạng thái:</strong> Sử dụng số điện thoại đã đăng ký để kiểm tra</li>
          <li><strong>Test API:</strong> Sử dụng Postman để test trực tiếp API</li>
        </ol>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          padding: '20px',
          border: '2px solid #1890ff',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h4 style={{ color: '#1890ff', marginBottom: '15px' }}>📝 Đăng Ký Tư Vấn</h4>
          <p style={{ marginBottom: '15px' }}>Điền thông tin để đăng ký tư vấn miễn phí</p>
          <Link to="/" style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#1890ff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '500'
          }}>
            Đi Đến Trang Chủ
          </Link>
        </div>

        <div style={{
          padding: '20px',
          border: '2px solid #52c41a',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h4 style={{ color: '#52c41a', marginBottom: '15px' }}>🔍 Kiểm Tra Trạng Thái</h4>
          <p style={{ marginBottom: '15px' }}>Kiểm tra trạng thái yêu cầu tư vấn</p>
          <Link to="/consultation-status" style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#52c41a',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '500'
          }}>
            Kiểm Tra Trạng Thái
          </Link>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h4 style={{ color: '#333', marginBottom: '15px' }}>🧪 Test API với Postman:</h4>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>1. Đăng ký tư vấn:</strong>
          <pre style={{
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '4px',
            fontSize: '12px',
            overflow: 'auto'
          }}>
{`POST http://localhost:8080/api/consultation/register
Content-Type: application/json

{
  "customerName": "Nguyễn Văn A",
  "phone": "0123456789",
  "email": "test@example.com",
  "content": "Tôi muốn tư vấn về xét nghiệm ADN huyết thống"
}`}
          </pre>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong>2. Kiểm tra trạng thái:</strong>
          <pre style={{
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '4px',
            fontSize: '12px',
            overflow: 'auto'
          }}>
{`GET http://localhost:8080/api/consultation/status/0123456789`}
          </pre>
        </div>
      </div>

      <div style={{
        backgroundColor: '#fff2e8',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #ffd591'
      }}>
        <h5 style={{ color: '#d46b08', marginBottom: '10px' }}>⚠️ Lưu ý:</h5>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Đảm bảo Backend đang chạy trên port 8080</li>
          <li>Kiểm tra console để xem lỗi nếu có</li>
          <li>Test với các trường hợp validation khác nhau</li>
        </ul>
      </div>
    </div>
  );
};

export default ConsultationDemo; 