import { ChevronRight } from "lucide-react"
import "./dnaTesting.css"

export default function DNATestingPage() {
  return (
    <div className="dna-testing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div>
          {/* Hero img with overlay content */}
          <div className="relative">
            <img
              src="https://vietcarelab.vn/wp-content/uploads/2023/03/3.jpg"
              alt="Bác sĩ chuyên khoa"
              className="hero-image"
            />

            {/* Overlay content */}
            <div className="overlay-content">
              {/* Breadcrumb */}
              <h1 className="hero-title">QUY TRÌNH XÉT NGHIỆM ADN</h1>
              <div className="breadcrumb">
                <span className="breadcrumb-home">HOME</span>
                <ChevronRight className="h-4 w-4 text-gray-300" />
                <span className="breadcrumb-current">QUY TRÌNH XÉT NGHIỆM ADN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="process-section">
        <div className="process-container">
          {/* Step 1 - Left Side */}
          <div className="process-step">
            <div className="step-header">
              <div className="step-number">BƯỚC 1</div>
              <h2 className="step-title">Tiếp nhận thông tin và tư vấn</h2>
            </div>

            <p className="step-description">
              Hãy liên hệ với chúng tôi theo số hotline hoặc điền form dưới. Đội ngũ chuyên gia của chúng tôi sẽ tư
              vấn giúp bạn chọn giải pháp phù hợp nhất.
            </p>

            <div className="step-image-container">
              <img
                src="https://vietcarelab.vn/wp-content/uploads/2023/08/vietcarelab-quy-trinh-2.jpg"
                alt="Tư vấn khách hàng"
                className="step-image"
              />
            </div>
          </div>

          {/* Step 2 - Right Side */}
          <div className="process-step step-right">
            <div className="step-header">
              <div className="step-number">BƯỚC 2</div>
              <h2 className="step-title">Thu mẫu</h2>
            </div>

            <p className="step-description">
              Bạn có thể gửi mẫu qua đường bưu điện, hoặc nhân viên của chúng tôi sẽ đến thu mẫu tại nhà.
            </p>

            <div className="step-image-container">
              <img
                src="https://vietcarelab.vn/wp-content/uploads/2023/08/vietcarelab-quy-trinh-3.jpg"
                alt="Thu mẫu xét nghiệm"
                className="step-image"
              />
            </div>
          </div>

          {/* Step 3 - Left Side */}
          <div className="process-step">
            <div className="step-header">
              <div className="step-number">BƯỚC 3</div>
              <h2 className="step-title">Phân tích</h2>
            </div>

            <p className="step-description">
              Mẫu sẽ được phân tích tại phòng thí nghiệm. Mọi thông tin sẽ được mã hóa và kiểm chứng độc lập bởi các
              chuyên gia nhằm đảm bảo độ chính xác tuyệt đối.
            </p>

            <div className="step-image-container">
              <img
                src="https://vietcarelab.vn/wp-content/uploads/2023/08/vietcarelab-quy-trinh-4.jpg"
                alt="Phân tích mẫu trong phòng lab"
                className="step-image"
              />
            </div>
          </div>

          {/* Step 4 - Right Side */}
          <div className="process-step step-right">
            <div className="step-header">
              <div className="step-number">BƯỚC 4</div>
              <h2 className="step-title">Trả kết quả</h2>
            </div>

            <p className="step-description">
              Kết quả sẽ được gửi tra theo đường bưu điện, qua email và qua điện thoại.
            </p>

            <div className="step-image-container">
              <img
                src="https://vietcarelab.vn/wp-content/uploads/2023/08/vietcarelab-quy-trinh-5.jpg"
                alt="Trả kết quả xét nghiệm"
                className="step-image"
              />
            </div>
          </div>

          {/* Step 5 - Left Side */}
          <div className="process-step">
            <div className="step-header">
              <div className="step-number">BƯỚC 5</div>
              <h2 className="step-title">Bảo hành kết quả</h2>
            </div>

            <p className="step-description">
              Sau khi trả kết quả, chúng tôi luôn đồng hành cùng bạn với mọi kết quả với những chính sách bảo hiểm
              và hỗ trợ chi phí.
            </p>

            <div className="step-image-container">
              <img
                src="https://vietcarelab.vn/wp-content/uploads/2023/08/vietcarelab-quy-trinh-6.jpg"
                alt="Bảo hành kết quả"
                className="step-image"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
