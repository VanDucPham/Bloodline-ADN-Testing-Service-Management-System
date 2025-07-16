// src/pages/Pricelist.jsx
import React, { useState, useEffect } from 'react';
import './Pricelist.css';
import { useNavigate } from 'react-router-dom';
import ComModal from '../ComModal/ComModal';
import Login from '../login/Login';
import apiService from '../../service/api';


function Pricelist() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingService, setPendingService] = useState(null);

  // Theo dõi đăng nhập
  useEffect(() => {
    if (showLoginModal && localStorage.getItem('authToken')) {
      // Đã đăng nhập thành công từ modal
      setShowLoginModal(false);
      if (pendingService) {
        navigate('/tracking_user', { state: { serviceId: pendingService } });
        setPendingService(null);
      }
    }
  }, [showLoginModal, pendingService, navigate]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await apiService.user.getAllServicePrice();
        setServices(response);
        console.log(response)
        setError(null);
      } catch (err) {
        console.error('Lỗi khi tải danh sách dịch vụ:', err);
        setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
        // Fallback về dữ liệu tĩnh nếu API lỗi
        
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="pricelist-section">
        <h2>BẢNG GIÁ DỊCH VỤ XÉT NGHIỆM ADN</h2>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Đang tải danh sách dịch vụ...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pricelist-section">
        <h2>BẢNG GIÁ DỊCH VỤ XÉT NGHIỆM ADN</h2>
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="pricelist-section">
      <h2>BẢNG GIÁ DỊCH VỤ XÉT NGHIỆM ADN</h2>
      
      <div className="service-card-list">
        {services.map((service) => (
          <div className="service-card" key={service.serviceId}>
            <img
              src={service.imageUrl }
              alt={service.serviceName}
              className="service-card-img"
              
            />
            <div className="service-card-body">
              <div className="service-card-title" onClick={() => navigate(`/service/${service.serviceId}`)} style={{color: '#007bff', textDecoration: 'underline', cursor: 'pointer'}}>{service.serviceName}</div>
              <div className="service-card-desc">{service.serviceDescription}</div>
              <ul className="service-card-info">
                <li><b>Thời gian:</b> 1-2 ngày</li>
                <li><b>Mẫu áp dụng:</b> Máu, tóc, niêm mạc miệng</li>
                {service.servicePrice >= 10000000 && (
                  <li className="service-card-promo">Tặng gói tư vấn di truyền</li>
                )}
              </ul>
              <div className="service-card-price">{service.servicePrice?.toLocaleString('vi-VN')} VNĐ</div>
              <button
                className="service-card-btn"
                onClick={() => {
                  if (localStorage.getItem('authToken')) {
                    navigate('/tracking_user', { state: { serviceId: service.serviceId } });
                  } else {
                    setPendingService(service.serviceId);
                    setShowLoginModal(true);
                  }
                }}
              >
                Đăng ký
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="pricelist-note">
        <strong>Lưu ý:</strong> Giá trên đã bao gồm tư vấn và trả kết quả. Vui lòng liên hệ để biết thêm chi tiết hoặc nhận ưu đãi mới nhất!
      </div>
      <ComModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} title="Đăng nhập để tiếp tục">
        <Login />
      </ComModal>
    </div>
  );
}

export default Pricelist;
