import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ServiceFeedback from './ServiceFeedback';
import './Pricelist.css';

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/customer/service/public/${id}`);
        setService(response.data);
        setError(null);
      } catch {
        setError('Không thể tải chi tiết dịch vụ.');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) return <div className="pricelist-section"><h2>Đang tải chi tiết dịch vụ...</h2></div>;
  if (error) return <div className="pricelist-section"><h2>{error}</h2></div>;
  if (!service) return null;

  return (
    <div className="pricelist-section">
      {/* Đã xóa nút quay lại */}
      <div className="service-card-detail">
        <img
          src={service.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
          alt={service.serviceName}
          className="service-card-img"
          style={{maxWidth: 400, marginBottom: 20}}
        />
        <h2>{service.serviceName}</h2>
        <div className="service-card-desc">{service.serviceDescription}</div>
        <div className="service-card-price">Giá: {service.servicePrice?.toLocaleString('vi-VN')} VNĐ</div>
        <ul className="service-card-info">
          <li><b>Thời gian:</b> 1-2 ngày</li>
          <li><b>Mẫu áp dụng:</b> Máu, tóc, niêm mạc miệng</li>
          {service.servicePrice >= 10000000 && (
            <li className="service-card-promo">Tặng gói tư vấn di truyền</li>
          )}
        </ul>
        <button className="service-card-btn" onClick={() => navigate('/pricelist')}>Xem bảng giá</button>
      </div>

      {/* Thêm phần feedback */}
      <div style={{ marginTop: '3rem' }}>
        <ServiceFeedback serviceId={id} />
      </div>
    </div>
  );
}

export default ServiceDetail; 