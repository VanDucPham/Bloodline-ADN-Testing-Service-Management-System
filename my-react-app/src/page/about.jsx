import { ChevronRight } from 'lucide-react';
import React from 'react';
import Header from '../components/Header';
import './about.css';


const AboutUs = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}

      <Header />
      <section className="hero-section">
        <div>
          {/* Hero img with overlay content */}
          <div className="relative">
            <img
              src="https://vietcarelab.vn/wp-content/uploads/2023/08/banner-vietcare-1-scaled.jpg"
              alt="Bác sĩ chuyên khoa"
              className="hero-image"
            />

            {/* Overlay content */}
            <div className="overlay-content">
              {/* Breadcrumb */}
              <h1 className="hero-title">Viện Nghiên Cứu Khoa Học Và Ứng Dụng Công Nghệ Vietcare</h1>
              <div className="breadcrumb">
                <span className="breadcrumb-home">HOME</span>
                <ChevronRight className="h-4 w-4 text-gray-300" />
                <span className="breadcrumb-current">VỀ CHÚNG TÔI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
       
        <div className="content-container">
          <div className="content-grid">
            {/* Left content */}
            <div>
              <div className="content-label">VIETCARELAB</div>
              <h2 className="content-title">
                VIỆN NGHIÊN CỨU KHOA HỌC VÀ ỨNG DỤNG
                <br />
                CÔNG NGHỆ VIETCARE
              </h2>

              <div className="content-block">
                <div>
                  <h3 className="section-title">Giới thiệu</h3>
                  <p className="content-text">
                    Viện Nghiên Cứu Khoa Học Và Ứng Dụng Công Nghệ Vietcare theo Quyết định số 554/ QĐ-KHCN của Sở Khoa
                    học và Công nghệ Thành phố Hồ Chí Minh. Lực lượng nòng cốt là các nhà khoa học đã làm việc tại các
                    viện và các trường đại học hàng đầu của Việt Nam như viện Hàn lâm Khoa học và Công nghệ Việt Nam,
                    Đại học Bách khoa Hà Nội, viện Pasteur trường đại học Y khoa ngoại. Bên cạnh, viện đã quy tụ được
                    một số nhà khoa học nghiên cứu viên giỏi 3 tiến sĩ, 5 thạc sĩ và 18 kỹ thuật viên chuyên nghiệp.
                  </p>
                </div>

                <div>
                  <p className="content-text">
                    Viện được xây dựng định hướng tới ứng dụng khoa học công nghệ vào nghiên cứu và phát triển những sản
                    phẩm, dịch vụ phục vụ đời sống, đặc biệt là y học và sản phẩm chăm sóc sức khỏe. Thế mạnh của
                    Vietcare là những nghiên cứu ứng dụng sinh học phân tử trong việc nghiên cứu và sáng tạo để đánh giá
                    truyền đạt. Đặc biệt, đội ngũ nghiên cứu viên của Vietcare là những chuyên gia đầu lĩnh ở Việt Nam
                    trong lĩnh vực phân tích hệ gen.
                  </p>
                </div>

                <div>
                  <h3 className="section-title">Tầm nhìn</h3>
                  <p className="content-text">
                    Viện Nghiên cứu Khoa học và Ứng dụng Công nghệ Vietcare phấn đấu trở thành một đơn vị hàng đầu trong ứng dụng tiến bộ khoa học công nghệ tiên tiến trên thế giới, phục vụ các nhu cầu thiết thực của đời sống, đặc biệt là sức khỏe con người.
                  </p>
                </div>
                <div>
                  <h3 className="section-title">Lĩnh vực hoạt động</h3>
                  <p className="content-text">
                    Một số hướng hoạt động chính của viện Nghiên cứu Khoa học và Ưng dụng Công nghệ Vietcare:
                  </p>
                  <p className="content-text">
                    - Tham gia các đề tài, dự án nghiên cứu khoa học của các sở, bộ khoa học.
                  </p>
                  <p className="content-text">
                    - Nghiên cứu phát triển sản phẩm và chuyển giao công nghệ theo đơn đặt hàng của doanh nghiệp và các tổ chức khác.
                  </p>
                  <p className="content-text">
                    - Đào tạo và chuyển giao công nghệ liên quan đến sinh học phân tử.
                  </p>
                  <p className="content-text">
                    - Cung cấp dịch vụ khoa học cho khách hàng:
                  </p>
                  <p className="content-text">
                    + Xét nghiệm huyết thống
                  </p>
                  <p className="content-text">
                    + Các xét nghiệm y học bao gồm xét nghiệm sàng lọc trước sinh và các xét nghiệm y học khác
                  </p>
                  <p className="content-text">
                    + Thực phẩm chức năng, các sản phẩm chăm sóc sức khỏe và sắc đẹp.
                  </p>
                  <p className="content-text">
                    + Các ứng dụng sinh học trong nông - lâm - ngư nghiệp.
                  </p>
                </div>
              </div>
            </div>

            {/* Right image */}
            <div>
              <img
                src="https://vietcarelab.vn/wp-content/uploads/2023/08/vien-nghien-cuu-vietcare-18.jpg"
                alt="Bác sĩ đang làm việc"
                width={600}
                height={500}
                className="content-image"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs; 