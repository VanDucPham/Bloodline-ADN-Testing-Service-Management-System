import React, { useState } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import apiService from '../../service/api';

const menuItems = [
  { name: 'TRANG CHỦ', path: '/' },
  {
    name: 'GIỚI THIỆU',
    submenu: [
      { name: 'Về chúng tôi' , path: '/about-us'},
      { name: 'Hỏi đáp ADN huyết thống', path: '/questionADN' },
    ]
  },
  { name: 'DỊCH VỤ' },
  { name: 'BẢNG GIÁ', path: '/pricelist' },
  {
    name: 'KIẾN THỨC',
    submenu: [
      { name: 'Tất cả bài viết', path: '/post' },
      { name: 'Xét nghiệm ADN' }
    ]
  },
  {
    name: 'DỰ ÁN',
    submenu: [
      { name: 'Dự án đang triển khai' },
      { name: 'Thư viện kỹ thuật' }
    ]
  },
  { name: 'LIÊN HỆ', action: 'scroll' }
];

function Header() {
  const [activeMenu, setActiveMenu] = useState('');
  const navigate = useNavigate();

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

  // Hàm xử lý nút LIÊN HỆ ở mọi trang
  const handleContactClick = () => {
    if (window.location.pathname === "/") {
      // Đã ở trang chủ, scroll luôn
      const el = document.getElementById("consultation-form");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      // Chuyển về trang chủ và truyền state
      navigate("/", { state: { scrollToConsultation: true } });
    }
  };

  const userData = localStorage.getItem('userInfo');
  const user = userData ? JSON.parse(userData) : null;
  const isLogin = !!user;
  const name = user?.fullName;
  const role = user?.role;

  const handleLogout = async () => {
    try {
      await apiService.auth.logout();
      localStorage.removeItem('userInfo');
      navigate('/');
    } catch (error) {
      console.error('Lỗi khi đăng xuất', error);
    }
  };

  return (
    <header className="main-header">
      <div className="header-top">
        <div className="header-logo-group">
          <img src="Component/images/logo.jpg" alt="Vietcare Logo" className="logo" />
          <div className="brand-title">
            <span className="brand-main">Vietcare Lab</span>
            <span className="brand-sub">Xét nghiệm ADN - Chính xác & Bảo mật</span>
          </div>
        </div>
        <div className="header-contact-group">
          <a href="tel:0339773330" className="header-hotline">
            <i className="fas fa-phone-alt"></i> 0339 773 330
          </a>
          <span className="header-email">
            <i className="fas fa-envelope"></i> vietcarelab@gmail.com
          </span>
          <span className="header-address">
            <i className="fas fa-map-marker-alt"></i> 388 đường 81, P.Tân Quy, Q.7, TP.HCM
          </span>
        </div>
      </div>

      <nav className="navbar">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`menu-item ${item.submenu ? 'dropdown' : ''} ${activeMenu === item.name ? 'active' : ''}`}
              onMouseEnter={() => item.submenu && setActiveMenu(item.name)}
              onMouseLeave={() => item.submenu && setActiveMenu('')}
              onClick={() => {
                if (item.name === 'LIÊN HỆ') {
                  handleContactClick();
                } else if (item.action === 'scroll') {
                  scrollToConsultationForm();
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
            >
              <span>{item.name}</span>
              {item.submenu && (
                <ul className="dropdown-menu">
                  {item.submenu.map((subItem) => (
                    <li
                      key={subItem.name || subItem}
                      onClick={e => {
                        e.stopPropagation();
                        if (subItem.path) navigate(subItem.path);
                      }}
                    >
                      <span>{subItem.name || subItem}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {!isLogin ? (
            <>
              <li>
                <button className="btn login-btn" onClick={() => navigate('/login')}>ĐĂNG NHẬP</button>
              </li>
              <li>
                <button className="btn register-btn" onClick={() => navigate('/register')}>ĐĂNG KÝ</button>
              </li>
            </>
          ) : (
            <>
              <li className="user-info">Xin chào, {name}</li>
              {role === 'ADMIN' && (
                <li>
                  <button className="btn" onClick={() => navigate('/admin')}>
                    <FontAwesomeIcon icon={faCircleUser} /> Admin
                  </button>
                </li>
              )}
              {role === 'STAFF' && (
                <>
                  <li><button className="btn" onClick={() => navigate('/staff/appointment')}>Lịch hẹn</button></li>
                  <li><button className="btn" onClick={() => navigate('/staff/appointment/create')}>+ Tạo lịch</button></li>
                </>
              )}
              {role === 'CUSTOMER' && (
                <li>
                  <button className="btn" onClick={() => navigate('/CustomerApointmentList')}>
                    <FontAwesomeIcon icon={faMoneyBill} /> Lịch hẹn
                  </button>
                </li>
              )}
              {role === 'MANAGER' && (
                <li>
                  <button className="btn" onClick={() => navigate('/manager')}>
                    <FontAwesomeIcon icon={faMoneyBill} /> Quản lý
                  </button>
                </li>
              )}
              <li>
                <button className="btn" onClick={() => navigate('/user')}>
                  <FontAwesomeIcon icon={faCircleUser} /> Hồ sơ
                </button>
              </li>
              <li>
                <button className="btn logout-btn" onClick={handleLogout}>ĐĂNG XUẤT</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
