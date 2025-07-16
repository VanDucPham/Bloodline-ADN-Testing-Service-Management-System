import './Homepage.css';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Footer from './components/Footer';
import axios from 'axios';
// import 'dotenv';
// dotenv.config();
// const handleFileUpload = () => {
//   const API = "f692f4eb8a8104c8622e537211c63d79"
//   const fileInput = document.getElementById('input-img');

//   const file = fileInput.files[0];
//   if (!file) {
//     alert('Please select a file to upload.');
//     return;
//   }

//   document.getElementById('preview').src = URL.createObjectURL(file);

//   const formData = new FormData();
//   formData.append('image', file);

//   fetch(`https://api.imgbb.com/1/upload?key=${API}`, {
//     method: 'POST',
//     body: formData,
//   }).then(response => response.json())
//     .then(data => {
//       if (data && data.data && data.data.url) {
//         document.getElementById('img_url').value = data.data.url;
//         // code luu database
//       } else {
//         alert('Error uploading image. Please try again.');
//       }
//     })
//     .catch(error => {
//       console.error('Error uploading image:', error);
//       alert('Error uploading image. Please try again.');
//     });
// }

const Homepage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const scrollToConsultationForm = () => {
    const element = document.getElementById('consultation-form');
    if (element) {
      // Tính toán vị trí scroll để form hiển thị đầy đủ
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
      
      window.scrollTo({
        top: middle,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (location.state?.scrollToConsultation) {
      const el = document.getElementById('consultation-form');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      }
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Sử dụng axios trực tiếp để tránh vấn đề baseURL
      const response = await axios.post('http://localhost:8080/api/consultation/register', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Kiểm tra xem có key success không
      if (response.data.success === true) {
        setMessage({ 
          type: 'success', 
          text: response.data.message 
        });
        // Reset form
        setFormData({
          customerName: '',
          phone: '',
          email: '',
          content: ''
        });
      } else {
        // Fallback: nếu không có success key, coi như thành công nếu status 200
        if (response.status === 200) {
          setMessage({ 
            type: 'success', 
            text: 'Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ với bạn trong vòng 30 phút.' 
          });
          // Reset form
          setFormData({
            customerName: '',
            phone: '',
            email: '',
            content: ''
          });
        } else {
          setMessage({ 
            type: 'error', 
            text: response.data.message || 'Có lỗi xảy ra' 
          });
        }
      }
    } catch (error) {
      console.error('Lỗi đăng ký tư vấn:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký tư vấn';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        {/* <input type='file' id='input-img'></input>
        <button onClick={handleFileUpload} >Submit</button>
        <input type="text" id="img_url" placeholder="Link ảnh sẽ hiện ở đây" readOnly />
        <img id="preview" style={{ maxWidth: "200px", marginTop: "10px" }} />
        <img src={data} width={100} height={100}></img> */}
      </div>
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
              <button className="btn-primary" onClick={scrollToConsultationForm}>LIÊN HỆ</button>
              <button className="btn-outline" onClick={() => navigate('/service-info')}>XEM THÊM</button>
            </div>
          </div>
        </div>
        <div className="about">
          <div className="about-content">
            <div className="images1">
              <img src="/src/images/vien-nghien-cuu-vietcare-20.jpg" alt="Scientist working" />
            </div>
            <div className="about-text">
              <h2>VIỆN NGHIÊN CỨU VIETCARE</h2>
              <p>
                Viện Nghiên Cứu Khoa Học Và Ứng Dụng Công Nghệ Vietcare theo Quyết định số 534/ĐK-KHCN của Sở Khoa học và Công nghệ TP. Hồ Chí Minh. Lực lượng nòng cốt là các nhà khoa học từ các đơn vị hàng đầu như Viện Hàn lâm Khoa học và Công nghệ Việt Nam, Đại học Bách khoa Hà Nội, và các trường đại học quốc tế. Đến nay, viện đã quy tụ 3 tiến sỹ, 6 thạc sỹ, 2 bác sỹ, và 18 kỹ thuật viên.
              </p>
              <button className="button-xemthem" onClick={() => navigate('/about-us')}>XEM THÊM</button>
            </div>
          </div>

          <div className="lab-header">
            <div className="about-text1">
              <h2>PHÒNG THÍ NGHIỆM CHUẨN QUỐC TẾ</h2>
              <p>Phòng thí nghiệm được trang bị những thiết bị tiên tiến nhất trong sinh học phân tử và phân tích di truyền. Đặc biệt, các hệ thống giải trình tự gen và hệ gen thế hệ mới đã được lắp đặt và vận hành, phục vụ nghiên cứu và dịch vụ xét nghiệm.</p>
              <button className="button-xemthem" onClick={() => navigate('/about-us')}>XEM THÊM</button>
            </div>
            <div className="images2">
              <img src="/src/images/vien-nghien-cuu-vietcare-21.jpg" alt="Scientist working" />
            </div>
          </div>

        </div>

        {/* Form tư vấn */}
        <div className="consultation-section" id="consultation-form">
          <div className="consultation-container">
            <div className="consultation-content">
              <div className="consultation-text">
                <h2>ĐĂNG KÝ TƯ VẤN MIỄN PHÍ</h2>
                <p>Nhận tư vấn chuyên sâu từ các chuyên gia hàng đầu về xét nghiệm ADN huyết thống</p>
                <div className="benefits-list">
                  <div className="benefit-item">
                    <FontAwesomeIcon icon={faCheck} />
                    <span>Tư vấn 24/7 hoàn toàn miễn phí</span>
                  </div>
                  <div className="benefit-item">
                    <FontAwesomeIcon icon={faCheck} />
                    <span>Ưu đãi 25% cho khách hàng đầu tiên</span>
                  </div>
                  <div className="benefit-item">
                    <FontAwesomeIcon icon={faCheck} />
                    <span>Bảo mật thông tin tuyệt đối</span>
                  </div>
                </div>
              </div>

              <div className="consultation-form-container">
                {/* Message Display */}
                {message.text && (
                  <div className={`message ${message.type}`}>
                    {message.type === 'success' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <span style={{ fontSize: '18px' }}>✅</span>
                        <span>{message.text}</span>
                      </div>
                    )}
                    {message.type === 'error' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <span style={{ fontSize: '18px' }}>❌</span>
                        <span>{message.text}</span>
                      </div>
                    )}
                  </div>
                )}

                <form className="consultation-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      name="customerName"
                      placeholder="Họ và tên *"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Số điện thoại *"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      name="content"
                      placeholder="Mô tả chi tiết về tình hình của bạn (bắt buộc, ít nhất 10 ký tự)"
                      rows="4"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="consultation-btn"
                    disabled={loading}
                    style={{
                      opacity: loading ? 0.7 : 1,
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ TƯ VẤN NGAY'}
                  </button>
                </form>
                <p className="form-note">
                  <FontAwesomeIcon icon={faCheck} />
                  Chúng tôi sẽ liên hệ với bạn trong vòng 30 phút
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  )
}



export default Homepage;