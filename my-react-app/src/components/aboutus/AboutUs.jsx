// src/pages/AboutUs.jsx
import React, { useRef, useEffect, useState } from 'react';
import './AboutUs.css';

const aboutContent = {
  title: 'VIỆN NGHIÊN CỨU KHOA HỌC VÀ ỨNG DỤNG CÔNG NGHỆ VIETCARE',
   image: "https://vietcarelab.vn/wp-content/uploads/2023/08/vien-nghien-cuu-vietcare-18.jpg", // ✅ ảnh online từ Vietcare
  sections: [
    {
      heading: 'Giới thiệu',
      content: `Viện Nghiên Cứu Khoa Học Và Ứng Dụng Công Nghệ Vietcare theo Quyết định số 534/ĐK-KHCN của Sở Khoa Học và Công Nghệ Thành phố Hồ Chí Minh. Lực lượng nòng cốt là các nhà khoa học đã làm việc tại các đơn vị nghiên cứu và các trường đại học hàng đầu Việt Nam như Viện Hàn lâm Khoa học và Công nghệ Việt Nam, Đại học Bách khoa Hà Nội, và các trường đại học ở nước ngoài. Đến nay, viện đã quy tụ được một đội ngũ cố vấn khoa học, nghiên cứu viên gồm 3 tiến sỹ, 6 thạc sỹ, 2 bác sỹ và 18 kỹ thuật viên chuyên nghiệp.

Viện được xây dựng định hướng tới ứng dụng hoặc hỗ trợ các nghiên cứu và phát triển những sản phẩm, dịch vụ phục vụ đời sống, đặc biệt là y học và sản phẩm chăm sóc sức khỏe. Thế mạnh của Vietcare là những nghiên cứu ứng sinh học phân tử trong xét nghiệm y học và sàng lọc bệnh di truyền. Đặc biệt, đội ngũ nghiên cứu viên của Vietcare là những chuyên gia đầu tiên ở Việt Nam trong lĩnh vực phân tích hệ gen.`
    },
    {
      heading: 'Tầm nhìn',
      content: `Viện Nghiên cứu Khoa học và Ứng dụng Công nghệ Vietcare định hướng trở thành một đơn vị hàng đầu trong ứng dụng tiến bộ khoa học công nghệ trên thế giới, phục vụ các nhu cầu thiết thực của đời sống, sức khỏe và sự phát triển con người.`
    },
    {
      heading: 'Lĩnh vực hoạt động',
      content: `Một số hướng hoạt động chính của Viện Nghiên cứu Khoa học và Ứng dụng Công nghệ Vietcare: Nghiên cứu, chuyển giao, đào tạo và ứng dụng khoa học công nghệ sinh học, y học phân tử, di truyền học, và công nghệ sinh học phân tử ứng dụng vào sản phẩm chăm sóc sức khỏe, xét nghiệm ADN và các giải pháp xét nghiệm di truyền phù hợp với người Việt.`
    }
  ]
};

function AboutUs() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState([0, 0, 0]);
  const sectionRef = useRef();

  const stats = [
    { label: 'Độ Chính Xác', value: 99.99, color: '#1976d2' },
    { label: 'Bảo Mật Thông Tin Khách Hàng', value: 100, color: '#1976d2' },
    { label: 'Tỉ Lệ Khách Hàng Hài Lòng', value: 95, color: '#1976d2' },
  ];

  // Animate progress and number
  useEffect(() => {
    if (!visible) return;
    let frame;
    const duration = 1200;
    const start = performance.now();
    function animate(now) {
      const elapsed = now - start;
      const percent = Math.min(elapsed / duration, 1);
      setProgress(stats.map(s => s.value * percent));
      if (percent < 1) frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  // Intersection Observer
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div className="aboutus-section">
        <h2>{aboutContent.title}</h2>
        <div className="aboutus-content">
          <div className="aboutus-text">
            {aboutContent.sections.map((section, index) => (
              <div key={index} className="aboutus-block">
                <h3>{section.heading}</h3>
                <p>{section.content}</p>
              </div>
            ))}
          </div>
          <div className="aboutus-image">
            <img
              src={aboutContent.image}
              alt="Phòng thí nghiệm Vietcare"
              onError={(e) => (e.target.src = "https://via.placeholder.com/400x300?text=No+Image")}
            />
          </div>
        </div>
      </div>

      {/* Phần Dịch vụ khoa học với progress bars */}
      <section className="aboutus-services-section" ref={sectionRef}>
        <div className="aboutus-services-content">
          <div className="aboutus-services-text">
            <h2>Dịch vụ khoa học của Vietcare</h2>
            <p>
              Nhằm đáp ứng nhu cầu của khách hàng, phòng thí nghiệm của viện Nghiên Cứu khoa học và Ứng dụng Công nghệ Vietcare đã được trang bị những thiết bị tối tân nhất như hệ thống realtime-PCR, giải trình tự gen và hệ gen phục vụ cho các xét nghiệm sinh học phân tử. Nhờ đó, làm tăng độ chính xác, tiết kiệm thời gian, và từng bước xây dựng lòng tin với khách hàng.
            </p>
            <div className="aboutus-stats">
              {stats.map((s, i) => (
                <div className="aboutus-stat" key={s.label}>
                  <div className="aboutus-stat-label">{s.label}</div>
                  <div className="aboutus-stat-value">
                    {progress[i].toFixed(2)}%
                  </div>
                  <div className="aboutus-progress-bar">
                    <div
                      className="aboutus-progress"
                      style={{
                        width: `${progress[i]}%`,
                        background: s.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="aboutus-services-image">
            <div className="aboutus-icon">
              <i className="fas fa-hospital-alt"></i>
            </div>
            <img
              src="/src/images/vien-nghien-cuu-vietcare-6.jpg"
              alt="Vietcare Lab"
              className="aboutus-services-img"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
