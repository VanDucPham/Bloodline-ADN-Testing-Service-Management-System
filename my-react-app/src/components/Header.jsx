import React, { useState } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../service/api';

const menuItems = [
  { name: 'TRANG CHỦ', path: '/' },
  {
    name: 'GIỚI THIỆU',
    submenu: ['Về chúng tôi', 'Hỏi đáp ADN huyết thống']
  },
  { name: 'DỊCH VỤ' },
  { name: 'BẢNG GIÁ', path: '/pricelist' },
  {
    name: 'KIẾN THỨC',
    submenu: ['Tất cả bài viết', 'Xét nghiệm ADN']
  },
  {
    name: 'DỰ ÁN',
    submenu: ['Dự án đang triển khai', 'Thư viện kỹ thuật']
  },
  { name: 'LIÊN HỆ' }
];

function Header() {
  const [activeMenu, setActiveMenu] = useState('');
  const navigate = useNavigate();

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
    <header className="header">
      <div className="top-bar">
        <img src="/logo.png" alt="Vietcare Logo" className="logo" />
        <div className="contact-info">
          <div>Hỗ trợ tư vấn 24/7 <br /><strong>Hoàn toàn MIỄN PHÍ</strong></div>
          <div>0339 773 330</div>
          <div>vietcarelab@gmail.com</div>
          <div>388 đường 81, P.Tân Quy, Q.7, TP.HCM</div>
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
              onClick={() => item.path && navigate(item.path)}
            >
              <span>{item.name}</span>
              {item.submenu && (
                <ul className="dropdown-menu">
                  {item.submenu.map((subItem) => (
                    <li key={subItem}><span>{subItem}</span></li>
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
                  <button className="btn" onClick={() => navigate('/tracking_user')}>
                    <FontAwesomeIcon icon={faMoneyBill} /> Đơn hàng
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
