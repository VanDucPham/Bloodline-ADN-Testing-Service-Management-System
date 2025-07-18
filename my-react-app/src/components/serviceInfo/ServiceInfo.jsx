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
    name: 'Xét nghiệm ADN Ti thể',
    desc: 'Xác định quan hệ Huyết thống theo dòng họ ngoại (Bà ngoại/Cháu...)',
  },
];

const processSteps = [
  {
    number: 1,
    title: 'Tiếp nhận thông tin và tư vấn',
    description: 'Hãy liên hệ với chúng tôi theo số hotline hoặc điền form dưới. Đội ngũ chuyên gia của chúng tôi sẽ tư vấn giúp bạn chọn giải pháp phù hợp nhất'
  },
  {
    number: 2,
    title: 'Thu lấy mẫu',
    description: 'Bạn có thể gửi mẫu qua đường bưu điện, hoặc nhân viên thu lấy mẫu của chúng tôi sẽ đến thu lấy mẫu tại nhà.'
  },
  {
    number: 3,
    title: 'Phân tích',
    description: 'Mẫu sẽ được phân tích tại phòng lab. Mọi thông tin sẽ được mã hóa và kiểm chứng độc lập bởi các chuyên gia. Nhằm đảm bảo độ chính xác tuyệt đối'
  },
  {
    number: 4,
    title: 'Trả kết quả',
    description: 'Kết quả sẽ được gửi trả theo đường bưu điện, qua email và qua điện thoại. Chỉ người đăng ký mới được nhận kết quả xét nghiệm, bảo mật thông tin tuyệt đối.'
  }
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

    {/* Quy trình lấy mẫu và xét nghiệm */}
    <div className="process-section">
      <div className="process-container">
        <h2 className="process-title">Quy trình lấy mẫu và xét nghiệm</h2>
        <p className="process-intro">
          Quy trình xét nghiệm ADN rất đơn giản. Bạn có thể lấy mẫu tại trung tâm hoặc nhân viên sẽ đến lấy mẫu tại nhà. 
          Kết quả sẽ được thông báo qua email, điện thoại và gửi qua đường bưu điện.
        </p>
        <div className="process-divider"></div>
        <div className="process-steps">
          {processSteps.map((step, idx) => (
            <div className="process-step" key={idx}>
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <div className="step-divider"></div>
                <p className="step-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ServiceInfo;
