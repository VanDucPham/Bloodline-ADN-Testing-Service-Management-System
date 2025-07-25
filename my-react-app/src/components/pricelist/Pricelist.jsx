// src/pages/Pricelist.jsx
import React, { useState, useEffect } from 'react';
import './Pricelist.css';
import { useNavigate } from 'react-router-dom';
import ComModal from '../ComModal/ComModal';
import Login from '../login/Login';
import apiService from '../../service/api';
import { FaRegPaperPlane, FaInfoCircle, FaStar } from 'react-icons/fa';


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

  const sampleReviews = [
    {
      name: 'Nguyễn Văn A',
      avatar: 'https://i.pravatar.cc/60?img=1',
      rating: 5,
      comment: 'Dịch vụ nhanh, nhân viên tư vấn tận tình, kết quả rõ ràng.'
    },
    {
      name: 'Trần Thị B',
      avatar: 'https://i.pravatar.cc/60?img=2',
      rating: 4,
      comment: 'Giá hợp lý, thủ tục đơn giản, sẽ giới thiệu bạn bè.'
    },
    {
      name: 'Lê Văn C',
      avatar: 'https://i.pravatar.cc/60?img=3',
      rating: 5,
      comment: 'Rất hài lòng với kết quả và sự hỗ trợ của trung tâm.'
    },
  ];

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
    <div className="pricelist-layout">
      <div className="pricelist-main">
        <div className="pricelist-section">
          <h2>BẢNG GIÁ DỊCH VỤ XÉT NGHIỆM ADN</h2>
          <div className="service-card-list">
            {services.map((service, idx) => (
              <div className="service-card fade-in-card" key={service.serviceId} style={{animationDelay: `${idx * 80}ms`}}>
                <img
                  src={service.imageUrl}
                  alt={service.serviceName}
                  className="service-card-img"
                />
                <div className="service-card-body">
                  <div className="service-card-title" onClick={() => navigate(`/service/${service.serviceId}`)}>{service.serviceName}</div>
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
                    <FaRegPaperPlane style={{marginRight: 8, fontSize: '1.1em'}} /> Đăng ký
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="pricelist-note">
            <FaInfoCircle style={{color:'#1976d2',marginRight:8,fontSize:'1.2em',verticalAlign:'-2px'}} />
            <strong>Lưu ý:</strong> Giá trên đã bao gồm tư vấn và trả kết quả. Vui lòng liên hệ để biết thêm chi tiết hoặc nhận ưu đãi mới nhất!
          </div>
          <ComModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} title="Đăng nhập để tiếp tục">
            <Login />
          </ComModal>
        </div>
      </div>
      <aside className="pricelist-sidebar">
        <div className="sidebar-block">
          <h3 className="sidebar-title">Đánh giá khách hàng</h3>
          <div className="review-list">
            {sampleReviews.map((r, i) => (
              <div className="review-card" key={i}>
                <img src={r.avatar} alt={r.name} className="review-avatar" />
                <div className="review-info">
                  <div className="review-name">{r.name}</div>
                  <div className="review-rating">
                    {[...Array(r.rating)].map((_, idx) => (
                      <FaStar key={idx} color="#fbc02d" style={{marginRight:2}} />
                    ))}
                  </div>
                  <div className="review-comment">{r.comment}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Pricelist;
