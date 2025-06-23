import './Homepage.css';
import Header from './components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCoffee, faHome, faBars, faCheck } from '@fortawesome/free-solid-svg-icons';
import Register from './components/register/Register';
import { useNavigate } from 'react-router-dom';
import Footer from './components/Footer';

const Homepage = () => {
const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div className='' >
        <div className="hero">
          <div className="hero-left">
            <h2>GIÁM ĐỊNH HUYẾT THỐNG</h2>
            <h1>Xét nghiệm <span className="ADN">ADN</span></h1>
            <ul className="feature-list">
              <ul className="feature-column">

                <li className="feature-item"> <FontAwesomeIcon icon={faCheck} style={{ marginRight: '8px' }} />  Trả kết quả từ 4h - 2 ngày</li>
                <li className="feature-item"> <FontAwesomeIcon icon={faCheck} style={{ marginRight: '8px' }} />  Độ chính xác 99,99%</li>
              </ul>
              <ul className="feature-column">
                <li className="feature-item"> <FontAwesomeIcon icon={faCheck} style={{ marginRight: '8px' }} />  Lấy mẫu ADN đơn giản</li>
                <li className="feature-item"> <FontAwesomeIcon icon={faCheck} style={{ marginRight: '8px' }} />  Bảo mật thông tin tuyệt đối</li>
              </ul>
            </ul>
            <div className="button-container">
              <button className="btn-primary">LIÊN HỆ</button>
              <button className="btn-outline">XEM THÊM</button>
            </div>
          </div>
        </div>
        <div className="about">
          <div className="about-content">
            <div className="images1">
              <img src="/images/vien-nghien-cuu-vietcare-20.jpg" alt="Scientist working" />
            </div>
            <div className="about-text">
              <h2>VIỆN NGHIÊN CỨU VIETCARE</h2>
              <p>
                Viện Nghiên Cứu Khoa Học Và Ứng Dụng Công Nghệ Vietcare theo Quyết định số 534/ĐK-KHCN của Sở Khoa học và Công nghệ TP. Hồ Chí Minh. Lực lượng nòng cốt là các nhà khoa học từ các đơn vị hàng đầu như Viện Hàn lâm Khoa học và Công nghệ Việt Nam, Đại học Bách khoa Hà Nội, và các trường đại học quốc tế. Đến nay, viện đã quy tụ 3 tiến sỹ, 6 thạc sỹ, 2 bác sỹ, và 18 kỹ thuật viên.
              </p>
              <button className="button-xemthem">XEM THÊM</button>
            </div>
          </div>

          <div className="lab-header">
            <div className="about-text1">
              <h2>PHÒNG THÍ NGHIỆM CHUẨN QUỐC TẾ</h2>
              <p>Phòng thí nghiệm được trang bị những thiết bị tiên tiến nhất trong sinh học phân tử và phân tích di truyền. Đặc biệt, các hệ thống giải trình tự gen và hệ gen thế hệ mới đã được lắp đặt và vận hành, phục vụ nghiên cứu và dịch vụ xét nghiệm.</p>
              <button className="button-xemthem">XEM THÊM</button>
            </div>
            <div className="images2">
              <img src="/images/vien-nghien-cuu-vietcare-21.jpg" alt="Scientist working" />
            </div>
          </div>

        </div>

        <div className="booking-section">
          <div className="booking-form-container">
            <h2>Đăng ký ngay để nhận <strong>ưu đãi 25% giá xét nghiệm</strong></h2>
            <p>Ưu đãi chỉ áp dụng cho 100 khách hàng đầu tiên trong tháng</p>
            
              <button className="login-btn" onClick={() => navigate('/register')} >
                ĐĂNG KÝ
              </button>
              
          </div>
        </div>

      </div>
       <Footer />
    </div>
  )
}



export default Homepage;