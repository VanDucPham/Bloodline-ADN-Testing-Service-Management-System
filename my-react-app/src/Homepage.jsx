import './Homepage.css';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUserMd, FaShieldAlt, FaClock, FaCheckCircle, FaMicroscope, FaUserTie } from 'react-icons/fa';

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

const benefits = [
  { icon: <FaClock />, title: 'Nhanh chóng', desc: 'Kết quả chỉ từ 24h, quy trình tối ưu.' },
  { icon: <FaShieldAlt />, title: 'Bảo mật', desc: 'Thông tin khách hàng được bảo mật tuyệt đối.' },
  { icon: <FaCheckCircle />, title: 'Chính xác', desc: 'Công nghệ xét nghiệm hiện đại, độ chính xác cao.' },
  { icon: <FaUserMd />, title: 'Hỗ trợ 24/7', desc: 'Đội ngũ chuyên gia tư vấn tận tâm.' },
];

const services = [
  { img: '/src/images/chi-phi-xet-nghiem-adn-1.jpg', title: 'Xét nghiệm huyết thống', desc: 'Xác định quan hệ cha con, mẹ con, anh chị em...' },
  { img: '/src/images/vien-nghien-cuu-vietcare-20.jpg', title: 'Xét nghiệm ADN pháp lý', desc: 'Kết quả có giá trị pháp lý, dùng cho tòa án, giấy khai sinh...' },
  { img: '/src/images/doctor.jpg', title: 'Tư vấn di truyền', desc: 'Tư vấn sức khỏe, phòng ngừa bệnh di truyền.' },
];

const steps = [
  { icon: <FaMicroscope />, title: 'Đăng ký', desc: 'Điền thông tin, chọn dịch vụ.' },
  { icon: <FaUserTie />, title: 'Lấy mẫu', desc: 'Lấy mẫu tại nhà hoặc tại cơ sở.' },
  { icon: <FaCheckCircle />, title: 'Xét nghiệm', desc: 'Phân tích mẫu tại phòng lab hiện đại.' },
  { icon: <FaShieldAlt />, title: 'Nhận kết quả', desc: 'Bảo mật, nhanh chóng, chính xác.' },
];

const experts = [
  { img: '/public/images/vien-nghien-cuu-vietcare-21.jpg', name: 'TS. Nguyễn Văn A', desc: 'Chuyên gia di truyền học, 15 năm kinh nghiệm.' },
  { img: '/public/images/vien-nghien-cuu-vietcare-6.jpg', name: 'BS. Lê Thị B', desc: 'Bác sĩ xét nghiệm, tư vấn di truyền.' },
  { img: '/public/images/image1-aboutus.jpg', name: 'PGS. Trần Văn C', desc: 'Cố vấn chuyên môn, nhiều công trình nghiên cứu.' },
];

const partners = [
  '/public/images/logo.jpg',
  '/public/images/vien-nghien-cuu-vietcare-20.jpg',
  '/public/images/vien-nghien-cuu-vietcare-21.jpg',
  '/public/images/vien-nghien-cuu-vietcare-6.jpg',
];

function useSectionFadeIn() {
  const ref = useRef([]);
  useEffect(() => {
    const handleScroll = () => {
      ref.current.forEach((el) => {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight - 80) {
            el.classList.add('fade-in');
          }
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return ref;
}

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
  const sectionRef = useSectionFadeIn();

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
      const response = await axios.post('https://bloodline-adn-testing.onrender.com/api/consultation/register', formData, {
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
    <div className="homepage-root">
      {/* HERO SECTION */}
      <section className="hero-section" ref={el => sectionRef.current[0] = el}>
        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-title">Dẫn đầu về xét nghiệm ADN tại Việt Nam</h1>
            <p className="hero-desc">Nhanh chóng, bảo mật, chính xác. Đội ngũ chuyên gia hàng đầu, công nghệ hiện đại, hỗ trợ tận tâm.</p>
            <a href="#register" className="hero-cta">Đăng ký tư vấn miễn phí</a>
          </div>
          <div className="hero-right">
            <img src="/src/images/backgroup-2-scaled.jpg" alt="ADN Lab" className="hero-img" />
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="benefit-section" ref={el => sectionRef.current[1] = el}>
        <h2 className="section-title">Tại sao chọn chúng tôi?</h2>
        <div className="benefit-list">
          {benefits.map((b, i) => (
            <div className="benefit-card" key={i}>
              <div className="benefit-icon">{b.icon}</div>
              <div className="benefit-title">{b.title}</div>
              <div className="benefit-desc">{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="service-section" ref={el => sectionRef.current[2] = el}>
        <h2 className="section-title">Dịch vụ nổi bật</h2>
        <div className="service-list">
          {services.map((s, i) => (
            <div className="service-card" key={i}>
              <img src={s.img} alt={s.title} className="service-img" />
              <div className="service-title">{s.title}</div>
              <div className="service-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="process-section" ref={el => sectionRef.current[3] = el}>
        <h2 className="section-title">Quy trình xét nghiệm</h2>
        <div className="process-list">
          {steps.map((s, i) => (
            <div className="process-step" key={i}>
              <div className="process-icon">{s.icon}</div>
              <div className="process-title">{s.title}</div>
              <div className="process-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERTS SECTION */}
      <section className="expert-section" ref={el => sectionRef.current[4] = el}>
        <h2 className="section-title">Đội ngũ chuyên gia</h2>
        <div className="expert-list">
          {experts.map((e, i) => (
            <div className="expert-card" key={i}>
              <img src={e.img} alt={e.name} className="expert-img" />
              <div className="expert-name">{e.name}</div>
              <div className="expert-desc">{e.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* REGISTER SECTION */}
      <section className="register-section" id="register" ref={el => sectionRef.current[5] = el}>
        <h2 className="section-title">Đăng ký tư vấn miễn phí</h2>
        {/* Message Display */}
        {message.text && (
          <div className={`message ${message.type}`} style={{marginBottom: '16px'}}>
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
        <form className="register-form" onSubmit={handleSubmit}>
          <input className="register-input" type="text" name="customerName" placeholder="Họ và tên *" value={formData.customerName} onChange={handleInputChange} required disabled={loading} />
          <input className="register-input" type="tel" name="phone" placeholder="Số điện thoại *" value={formData.phone} onChange={handleInputChange} required disabled={loading} />
          <input className="register-input" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} disabled={loading} />
          <textarea className="register-input" name="content" placeholder="Nội dung cần tư vấn" rows={3} value={formData.content} onChange={handleInputChange} disabled={loading} />
          <button className="register-btn" type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'ĐANG XỬ LÝ...' : 'Gửi đăng ký'}
          </button>
        </form>
        <p className="form-note" style={{textAlign:'center',marginTop:'12px',color:'#1976d2'}}>
          <FontAwesomeIcon icon={faCheck} /> Chúng tôi sẽ liên hệ với bạn trong vòng 30 phút
        </p>
      </section>

      {/* PARTNER SECTION */}
      <section className="partner-section" ref={el => sectionRef.current[6] = el}>
        <div className="partner-list">
          {partners.map((p, i) => (
            <img src={p} alt="Đối tác" className="partner-logo" key={i} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Homepage;