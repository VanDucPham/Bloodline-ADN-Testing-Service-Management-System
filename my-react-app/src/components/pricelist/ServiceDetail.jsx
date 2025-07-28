import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ServiceFeedback from './ServiceFeedback';
import './Pricelist.css';
import apiService from '../../service/api';
import { FaArrowLeft, FaClock, FaVial, FaGift, FaPhoneAlt, FaCheckCircle } from 'react-icons/fa';

// Dữ liệu fallback khi API lỗi
const fallbackServices = {
  '1': {
    serviceId: 1,
    serviceName: 'Xét nghiệm ADN tự nguyện trực hệ',
    serviceDescription: 'Xác định quan hệ Cha/Con, Mẹ/Con. Xét nghiệm ADN dân sự tự nguyện chỉ mang tính chất biết kết quả trong gia đình, không có giá trị pháp lý.',
    servicePrice: 1000000,
    imageUrl: 'https://via.placeholder.com/400x200?text=Xét+nghiệm+ADN+trực+hệ',
    details: {
      duration: '1-2 ngày',
      samples: ['Máu', 'Tóc', 'Niêm mạc miệng'],
      accuracy: '99.99%',
      features: [
        'Kết quả nhanh chóng trong 1-2 ngày',
        'Độ chính xác cao 99.99%',
        'Bảo mật thông tin tuyệt đối',
        'Tư vấn miễn phí trước và sau xét nghiệm'
      ],
      process: [
        'Tư vấn và đăng ký dịch vụ',
        'Lấy mẫu tại trung tâm hoặc tận nơi',
        'Phân tích mẫu tại phòng lab',
        'Trả kết quả và tư vấn'
      ]
    }
  },
  '2': {
    serviceId: 2,
    serviceName: 'Xét nghiệm ADN pháp lý trực hệ',
    serviceDescription: 'Xác định quan hệ Cha/Con, Mẹ/Con. Xét nghiệm ADN để làm thủ tục hành chính cơ bản như: làm giấy khai sinh, đổi họ cho con, nhận quyền thừa kế.',
    servicePrice: 1500000,
    imageUrl: 'https://via.placeholder.com/400x200?text=Xét+nghiệm+ADN+pháp+lý',
    details: {
      duration: '3-5 ngày',
      samples: ['Máu', 'Tóc', 'Niêm mạc miệng'],
      accuracy: '99.99%',
      features: [
        'Có giá trị pháp lý',
        'Được công nhận bởi tòa án',
        'Quy trình chuẩn quốc tế',
        'Giấy chứng nhận chính thức'
      ],
      process: [
        'Đăng ký và chuẩn bị giấy tờ',
        'Lấy mẫu có giám sát',
        'Phân tích tại phòng lab được chứng nhận',
        'Cấp giấy chứng nhận có giá trị pháp lý'
      ]
    }
  }
};

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await apiService.auth.detailService(id);
        setService(response);
        setError(null);
        setUsingFallback(false);
      } catch (err) {
        console.error('API Error, using fallback data:', err);
        // Sử dụng dữ liệu fallback
        const fallbackService = fallbackServices[id];
        if (fallbackService) {
          setService(fallbackService);
          setUsingFallback(true);
          setError(null);
        } else {
          setError('Không thể tải chi tiết dịch vụ.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="pricelist-section">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div className="loading-spinner"></div>
          <h2>Đang tải chi tiết dịch vụ...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pricelist-section">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2 style={{ color: '#e74c3c' }}>{error}</h2>
          <button 
            className="service-card-btn" 
            onClick={() => navigate('/pricelist')}
            style={{ marginTop: '20px', maxWidth: '200px' }}
          >
            <FaArrowLeft style={{ marginRight: '8px' }} />
            Quay lại bảng giá
          </button>
        </div>
      </div>
    );
  }

  if (!service) return null;

  return (
    <div className="pricelist-section">
      {/* Nút quay lại */}
      <button 
        className="back-button"
        onClick={() => navigate('/pricelist')}
        style={{
          background: 'none',
          border: 'none',
          color: '#1976d2',
          fontSize: '1rem',
          cursor: 'pointer',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <FaArrowLeft /> Quay lại bảng giá
      </button>

      {/* Thông báo sử dụng dữ liệu fallback */}
      {usingFallback && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          color: '#856404'
        }}>
          <strong>Lưu ý:</strong> Đang hiển thị thông tin mẫu do lỗi kết nối. Vui lòng liên hệ để biết thông tin chính xác.
        </div>
      )}

      <div className="service-detail-container">
        {/* Phần thông tin chính */}
        <div className="service-main-info">
          <img
            src={service.imageUrl || "https://via.placeholder.com/400x200?text=No+Image"}
            alt={service.serviceName}
            className="service-detail-img"
            style={{
              width: '100%',
              maxWidth: '400px',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '12px',
              marginBottom: '20px'
            }}
          />
          
          <h1 style={{ color: '#1976d2', marginBottom: '16px' }}>
            {service.serviceName}
          </h1>
          
          <p style={{ fontSize: '1.1rem', color: '#444', marginBottom: '20px', lineHeight: '1.6' }}>
            {service.serviceDescription}
          </p>
          
          <div className="service-price-highlight" style={{
            background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
              {service.servicePrice?.toLocaleString('vi-VN')} VNĐ
            </div>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>
              Giá đã bao gồm tư vấn và trả kết quả
            </div>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        {service.details && (
          <div className="service-details-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '30px'
          }}>
            {/* Thông tin cơ bản */}
            <div className="detail-card" style={{
              background: '#f8fafc',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ color: '#1976d2', marginBottom: '16px' }}>
                <FaClock style={{ marginRight: '8px' }} />
                Thông tin cơ bản
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Thời gian:</strong> {service.details.duration}
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Độ chính xác:</strong> {service.details.accuracy}
                </li>
                <li>
                  <strong>Mẫu áp dụng:</strong> {service.details.samples?.join(', ')}
                </li>
              </ul>
            </div>

            {/* Ưu điểm */}
            <div className="detail-card" style={{
              background: '#f0f9ff',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #bae6fd'
            }}>
              <h3 style={{ color: '#1976d2', marginBottom: '16px' }}>
                <FaCheckCircle style={{ marginRight: '8px' }} />
                Ưu điểm nổi bật
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {service.details.features?.map((feature, index) => (
                  <li key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'flex-start' }}>
                    <FaCheckCircle style={{ color: '#10b981', marginRight: '8px', marginTop: '2px', fontSize: '0.9rem' }} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Quy trình thực hiện */}
        {service.details?.process && (
          <div className="process-section" style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#1976d2', marginBottom: '20px', textAlign: 'center' }}>
              Quy trình thực hiện
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {service.details.process.map((step, index) => (
                <div key={index} style={{
                  background: '#fff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '2px solid #e3f2fd',
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    background: '#1976d2',
                    color: 'white',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ fontSize: '0.95rem', color: '#444' }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nút hành động */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button 
            className="service-card-btn" 
            onClick={() => navigate('/pricelist')}
            style={{ 
              maxWidth: '300px',
              margin: '0 auto'
            }}
          >
            <FaPhoneAlt style={{ marginRight: '8px' }} />
            Liên hệ tư vấn ngay
          </button>
        </div>

        {/* Khuyến mãi */}
        {service.servicePrice >= 10000000 && (
          <div style={{
            background: 'linear-gradient(135deg, #f39c12, #e67e22)',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <FaGift style={{ marginRight: '8px', fontSize: '1.2rem' }} />
            <strong>Khuyến mãi đặc biệt:</strong> Tặng gói tư vấn di truyền trị giá 500.000 VNĐ
          </div>
        )}
      </div>

      {/* Phần feedback */}
      <div style={{ marginTop: '3rem' }}>
        <ServiceFeedback serviceId={id} />
      </div>
    </div>
  );
}

export default ServiceDetail; 