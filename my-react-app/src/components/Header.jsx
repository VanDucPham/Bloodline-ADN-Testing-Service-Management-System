<<<<<<< Updated upstream
import React from 'react';
import './Header.css';
import { useNavigate, Link } from 'react-router-dom';
import apiService from '../service/api';

const Header = () => {
=======
import React, { useState } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';

function Header() {
  const [activeMenu, setActiveMenu] = useState('');
>>>>>>> Stashed changes
  const navigate = useNavigate();

  // Lấy dữ liệu từ localStorage và kiểm tra trước khi sử dụng
  const userData = localStorage.getItem('userInfo');
  const user = userData ? JSON.parse(userData) : null;

  // Xác định trạng thái đăng nhập và vai trò
  const isLogin = !!user;
  const name = user?.fullName;
  const role = user?.role;
  const email = user?.email;
  console.log(email)
  const handleLogout = async () => {
    try {
       await apiService.auth.logout()
       navigate("/")
    } catch (error) {
      console.error("lỗi khi đăng suất", error)
    }
  };

  return (
    <header className="header">
<<<<<<< Updated upstream
      <div className="logo" onClick={() => navigate('/')}>
        <h1>VietCare</h1>
      </div>

      <nav className="nav-links">
        <Link to="/">Trang chủ</Link>
        <Link to="/services">Dịch vụ</Link>
        <Link to="/contact">Liên hệ</Link>

        {!isLogin && (
          <>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng ký</Link>
          </>
        )}

        {isLogin && (
          <>
            <span className="user-info">Xin chào, {name}</span>

            {role === 'ADMIN' && <Link to="/admin">Trang Admin</Link>}
            {role === 'STAFF' && <Link to="/staff">Trang Nhân Viên</Link>}
            {role === 'CUSTOMER' &&(
            <>
            <Link to="/customer">Đăng kí dịch vụ</Link>
            <Link to="/profile"> Hồ sơ </Link>  
            </> )  }
            <li>
              <button className="logout-btn" onClick={handleLogout}>
              Đăng xuất
            </button>
            </li>
            
          </>
        )}
=======
      <div className="top-bar">
        <img src="/logo.png" alt="Vietcare Logo" className="logo" />
        <div className="contact-info">
          <div>Hỗ trợ tư vấn 24/7 <br /><strong>Hoàn toàn MIỄN PHÍ</strong></div>
          <div>0339 773 330</div>
          <div>vietcarelab@gmail.com</div>
          <div>388 đường 81, phường Tân Quy<br />quận 7, TP. Hồ Chí Minh</div>
        </div>
      </div>

      <nav className="navbar">
        <ul>
          {[
            { name: 'TRANG CHỦ' },
            {
              name: 'GIỚI THIỆU', submenu: ['Về chúng tôi', 'Hỏi đáp ADN huyết thống']
            },
            {
              name: 'DỊCH VỤ'
            },
            {
              name: 'BẢNG GIÁ'
            },
            {
              name: 'KIẾN THỨC', submenu: ['Tất cả bài viết', 'Xét nghiệm ADN']
            },
            {
              name: 'DỰ ÁN', submenu: ['Dự án đang triển khai', 'Thư viện kỹ thuật']
            },
            {
              name: 'LIÊN HỆ'
            }
          ].map((item) => (
            <li
              key={item.name}
              className={`menu-item ${item.submenu ? 'dropdown' : ''} ${activeMenu === item.name ? 'active' : ''}`}
              onClick={() => {
        setActiveMenu(item.name);
        if (item.name === 'BẢNG GIÁ') {
          navigate('/pricelist');
        }
        if (item.name === 'TRANG CHỦ') {
          navigate('/');
        }
      }}
            >
              <a href="#">{item.name}</a>
              {item.submenu && (
                <ul className="dropdown-menu">
                  {item.submenu.map((subItem) => (
                    <li key={subItem}><a href="#">{subItem}</a></li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          <li>
            <button className="login-btn" onClick={() => navigate('/login')} >
              ĐĂNG NHẬP
            </button>
          </li> <FontAwesomeIcon icon={faMagnifyingGlass} /><FontAwesomeIcon icon={faGoogle} />
          
          <li>
            <a className="user-btn" onClick={() => navigate('/user')} title="Hồ sơ cá nhân" >
              <FontAwesomeIcon icon={faCircleUser} />
            </a>
          </li>


          <li>
            <a className="admin-btn" onClick={() => navigate('/admin')} title="Trang admin" >
              <FontAwesomeIcon icon={faCircleUser} />
            </a>
          </li>
          <li>
            <a className="payment-btn" onClick={() => navigate('/payment')}>
              <FontAwesomeIcon icon={faMoneyBill} />
            </a>
</li>
        
          


        </ul>
>>>>>>> Stashed changes
      </nav>
    </header>
  );
};

export default Header;
