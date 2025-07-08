import React from 'react';

import './Pricelist.css';
import { useNavigate } from 'react-router-dom';

const services = [
    {
        name: 'Xét nghiệm ADN cha con',
        description: 'Kết quả nhanh, chính xác, bảo mật tuyệt đối.',
        price: 1500000
    },
    {
        name: 'Xét nghiệm ADN huyết thống mẹ con',
        description: 'Dành cho xác định quan hệ mẹ - con.',
        price: 1500000
    },
    {
        name: 'Xét nghiệm ADN anh/chị/em ruột',
        description: 'Kiểm tra quan hệ huyết thống giữa anh/chị/em.',
        price: 1800000
    },
    {
        name: 'Xét nghiệm ADN hành chính',
        description: 'Dùng cho mục đích pháp lý, hành chính.',
        price: 2500000
    },
    {
        name: 'Xét nghiệm ADN trước sinh (NIPT)',
        description: 'Không xâm lấn, an toàn cho mẹ và bé.',
        price: 12000000
    }
];



function Pricelist() {
    const navigate = useNavigate();
    return (
        <>
           
            <div className='pricelist-section'>
                <div className='pricelist-header'>
                    <span>HOME &gt; BẢNG GIÁ XÉT NGHIỆM ADN</span>
                </div>
            </div>

            <div className="pricelist-info">
                <h3>Xét nghiệm ADN là gì?</h3>
                <p>
                    ADN (Axit DeoxyriboNucleic) là vật chất di truyền tồn tại trong nhiễm sắc thể và nhân tế bào, đóng vai trò lưu trữ thông tin di truyền của các sinh vật sống.
                </p>
                <p>
                    Xét nghiệm ADN là phương pháp phân tích gen để xác định mối quan hệ huyết thống giữa hai cá thể thông qua ADN trong tế bào cơ thể. Ngoài việc xác định huyết thống, xét nghiệm ADN còn được sử dụng trong lĩnh vực điều tra hình sự.
                </p>
                <p>
                    Độ chính xác của xét nghiệm ADN có thể đạt đến 99,99% nếu mẫu cha mẹ và con khớp nhau từng alen. Nếu có hơn 2 alen không khớp, điều này chỉ ra 100% rằng hai người đó không có mối quan hệ huyết thống.
                </p>
                <p>
                    Mẫu xét nghiệm ADN huyết thống có thể bao gồm tóc, máu, móng tay, mô xương hoặc răng. Độ chính xác của các mẫu này không có sự chênh lệch đáng kể.
                </p>
                <div className="pricelist-image">
                    <img src="/images/chi-phi-xet-nghiem-adn-1.jpg" alt="Xét nghiệm ADN là gì" style={{ maxWidth: '100%', borderRadius: '12px', marginTop: '16px' }} />
                </div>
            </div>

            <div className="pricelist-container">
                <h2>BẢNG GIÁ DỊCH VỤ XÉT NGHIỆM ADN</h2>
                <div className="pricelist-card-list">
                    {services.map((s, idx) => (
                        <div className="pricelist-card" key={idx}>
                            <div className="pricelist-card-name">{s.name}</div>
                            <div className="pricelist-card-desc">{s.description}</div>
                            <div className="pricelist-card-price">{s.price.toLocaleString('vi-VN')} VNĐ</div>
                            <button
                                className="pricelist-register-btn"
                                onClick={() => navigate('/booking', { state: { service: s.name } })}
                            >
                                Đăng ký
                            </button>
                        </div>
                    ))}
                </div>
                <div className="pricelist-note">
                    <strong>Lưu ý:</strong> Giá trên đã bao gồm tư vấn và trả kết quả. Vui lòng liên hệ để biết thêm chi tiết hoặc nhận ưu đãi mới nhất!
                </div>
            </div>
        </>
    );
}

export default Pricelist;