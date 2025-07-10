// src/pages/AboutUs.jsx
import React from 'react';
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
  return (
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
  );
}

export default AboutUs;
