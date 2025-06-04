import './App.css';
import Header from './components/Header';

function App() {
  return (
    <div>
      <Header />
      <section className="hero">
        <div className="hero-left">
          <h2>GIÁM ĐỊNH HUYẾT THỐNG</h2>
          <h1>Xét nghiệm <span className="ADN">ADN</span></h1>
          <ul className="feature-list">
           <ul className="feature-column">
              <li className="feature-item">Trả kết quả từ 4h - 2 ngày</li>
              <li className="feature-item">Độ chính xác 99,99%</li>
            </ul>
            <ul className="feature-column">
              <li className="feature-item">Lấy mẫu ADN đơn giản</li>
              <li className="feature-item">Bảo mật thông tin tuyệt đối</li>
            </ul>
          </ul>
          <div className="button-container">
            <button className="btn-primary">LIÊN HỆ</button>
            <button className="btn-outline">XEM THÊM</button>
          </div>
        </div>
      </section>
      <section className="about">
        <div className="about-content">
          <div className="images">
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
            <h2>Phòng thí nghiệm chuẩn Quốc tế</h2>
            <p>Phòng thí nghiệm được trang bị thiết bị tiên tiến nhất trong sinh học phân tử và phân tích di truyền, với hệ thống giải trình tự gen thế hệ mới.</p>
          </div>
        
      </section>
    </div>
  );
}

export default App;