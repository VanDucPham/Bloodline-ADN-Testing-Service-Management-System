import React from 'react';
import './ServiceInfo.css';
import { FaCheckCircle, FaUserFriends, FaVial, FaHandshake, FaUserMd } from 'react-icons/fa';

const reasons = [
  'Dịch vụ xét nghiệm chính xác tuyệt đối, kết quả nhanh chóng.',
  'Đội ngũ chuyên gia giàu kinh nghiệm, tư vấn tận tâm.',
  'Quy trình chuẩn quốc tế, bảo mật tuyệt đối.',
  'Giá cả cạnh tranh, nhiều ưu đãi cho khách hàng mới.',
  'Hỗ trợ lấy mẫu tận nơi 24/7.',
];

const stats = [
  { icon: <FaUserFriends />, value: '10.000+', label: 'Khách hàng' },
  { icon: <FaVial />, value: '40.000+', label: 'Mẫu xét nghiệm' },
  { icon: <FaHandshake />, value: '500+', label: 'Đối tác' },
  { icon: <FaUserMd />, value: '100+', label: 'Nhân viên' },
];

const services = [
  {
    oldPrice: '1.300.000đ/mẫu',
    newPrice: '1.000.000đ/mẫu',
    name: 'Xét nghiệm ADN tự nguyện trực hệ',
    desc: 'Xác định quan hệ Cha/Con, Me/Con. Xét nghiệm ADN dân sự tự nguyện chỉ mang tính chất biết kết quả trong gia đình, không có giá trị pháp lý',
    highlight: true,
  },
  {
    oldPrice: '2.000.000đ/mẫu',
    newPrice: '1.500.000đ/mẫu',
    name: 'Xét nghiệm ADN pháp lý trực hệ',
    desc: 'Xác định quan hệ hệ Cha/Con, Me/Con. Xét nghiệm ADN để làm thủ tục hành chính cơ bản như: làm giấy khai sinh, đổi họ cho con, nhận quyền thừa kế',
  },
  {
    oldPrice: '26.600.000đ/gói',
    newPrice: '20.000.000đ/gói',
    name: 'Xét nghiệm ADN Thai nhi',
    desc: 'Xét nghiệm ADN Thai nhi từ 7 tuần tuổi không xâm lấn (lấy mẫu từ máu mẹ, đảm bảo an toàn cho thai nhi)',
  },
  {
    oldPrice: '2.600.000đ/mẫu',
    newPrice: '2.000.000đ/mẫu',
    name: 'Xét nghiệm ADN tự nguyện bằng NST X/Y',
    desc: 'Xác định quan hệ Bà nội/Cháu gái,... và Ông nội/Cháu trai,... Xét nghiệm ADN chỉ mang tính chất biết kết quả trong gia đình, không có giá trị pháp lý',
  },
  {
    oldPrice: '3.300.000đ/mẫu',
    newPrice: '2.500.000đ/mẫu',
    name: 'Xét nghiệm ADN pháp lý bằng NST X/Y',
    desc: 'Xác định quan hệ hệ Bà nội/Cháu gái,... và Ông nội/Cháu trai,... Xét nghiệm ADN để làm thủ tục hành chính cơ bản',
  },
  {
    oldPrice: '4.600.000đ/mẫu',
    newPrice: '3.500.000đ/mẫu',
    name: 'Xét nghiệm ADN Ti thống',
    desc: 'Xác định quan hệ Huyết thống theo dòng họ ngoại (Bà ngoại/Cháu...)',
  },
];

const ServiceInfo = () => (
  <div className="service-info-bg">
    <div className="service-info-container">
      <div className="service-info-left">
        <h2 style={{ color: '#222' }}>DỊCH VỤ</h2>
        <div className="service-info-title-bar" />
        <p>
          Vietcare cung cấp các dịch vụ xét nghiệm ADN, sàng lọc gen, kiểm tra huyết thống và nhiều dịch vụ y tế hiện đại khác. Chúng tôi cam kết mang lại kết quả chính xác, bảo mật và nhanh chóng nhất cho khách hàng.
        </p>
      </div>
      <div className="service-info-right">
        <h3 className="service-info-why-title">Tại sao nên chọn <span>Vietcare</span>?</h3>
        <ul className="service-info-reasons">
          {reasons.map((reason, idx) => (
            <li key={idx}><FaCheckCircle className="reason-icon" /> {reason}</li>
          ))}
        </ul>
      </div>
    </div>
    <div className="service-info-stats">
      {stats.map((stat, idx) => (
        <div className="stat-item" key={idx}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
    {/* Bảng giá dịch vụ */}
    <div className="service-price-list">
      <h2 className="service-price-title">Dịch Vụ</h2>
      <div className="service-price-grid">
        {services.map((s, idx) => (
          <div className={s.highlight ? 'service-price-card highlight' : 'service-price-card'} key={idx}>
            <div className="service-price-old">{s.oldPrice}</div>
            <div className="service-price-new">{s.newPrice}</div>
            <div className="service-price-name">{s.name}</div>
            <div className="service-price-desc">{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ServiceInfo; 