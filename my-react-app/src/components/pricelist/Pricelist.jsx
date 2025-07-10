// src/pages/Pricelist.jsx
import React from 'react';
import './Pricelist.css';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    name: 'Xét nghiệm ADN cha con',
    description: 'Kết quả nhanh, chính xác, bảo mật tuyệt đối.',
    price: 1500000,
    time: '1-2 ngày',
    sample: 'Máu, tóc, niêm mạc miệng',
    promo: 'Giảm 10% cho khách hàng đăng ký online',
    image: '/images/adn-cha-con.jpg'
  },
  {
    name: 'Xét nghiệm ADN mẹ con',
    description: 'Dành cho xác định quan hệ mẹ - con.',
    price: 1500000,
    time: '1-2 ngày',
    sample: 'Máu, tóc, niêm mạc miệng',
    promo: '',
    image: '/images/adn-me-con.jpg'
  },
  {
    name: 'Xét nghiệm ADN anh/chị/em ruột',
    description: 'Kiểm tra quan hệ huyết thống giữa anh/chị/em.',
    price: 1800000,
    time: '2-3 ngày',
    sample: 'Máu, tóc, niêm mạc miệng',
    promo: '',
    image: '/images/adn-anh-em.jpg'
  },
  {
    name: 'Xét nghiệm ADN hành chính',
    description: 'Dùng cho mục đích pháp lý, hành chính.',
    price: 2500000,
    time: '3-5 ngày',
    sample: 'Máu, tóc',
    promo: 'Miễn phí tư vấn pháp lý',
    image: '/images/adn-hanh-chinh.jpg'
  },
  {
    name: 'Xét nghiệm ADN trước sinh (NIPT)',
    description: 'Không xâm lấn, an toàn cho mẹ và bé.',
    price: 12000000,
    time: '7-10 ngày',
    sample: 'Máu mẹ',
    promo: 'Tặng gói tư vấn di truyền',
    image: '/images/adn-nipt.jpg'
  }
];

function Pricelist() {
  const navigate = useNavigate();
  return (
    <div className="pricelist-section">
      <h2>BẢNG GIÁ DỊCH VỤ XÉT NGHIỆM ADN</h2>
      <div className="service-card-list">
        {services.map((s, idx) => (
          <div className="service-card" key={idx}>
            <img
              src={s.image}
              alt={s.name}
              className="service-card-img"
              onError={e => (e.target.src = "https://via.placeholder.com/300x200?text=No+Image")}
            />
            <div className="service-card-body">
              <div className="service-card-title">{s.name}</div>
              <div className="service-card-desc">{s.description}</div>
              <ul className="service-card-info">
                <li><b>Thời gian:</b> {s.time}</li>
                <li><b>Mẫu áp dụng:</b> {s.sample}</li>
                {s.promo && <li className="service-card-promo">{s.promo}</li>}
              </ul>
              <div className="service-card-price">{s.price.toLocaleString('vi-VN')} VNĐ</div>
              <button
                className="service-card-btn"
                onClick={() => navigate('/booking', { state: { service: s.name } })}
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
    </div>
  );
}

export default Pricelist;
