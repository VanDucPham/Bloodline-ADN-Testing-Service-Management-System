import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../service/api';
import './Header.css';

const menuItems = [
  { name: 'TRANG CHỦ', path: '/' },
  {
    name: 'GIỚI THIỆU',
    submenu: [
      { label: 'Về chúng tôi', path: '/about' },
      { label: 'Hỏi đáp ADN', path: '/faq' }
    ]
  },
  { name: 'DỊCH VỤ', path: '/services' },
  { name: 'BẢNG GIÁ', path: '/pricelist' },
  {
    name: 'KIẾN THỨC',
    submenu: [
      { label: 'Tất cả bài viết', path: '/post' },
      { label: 'Xét nghiệm ADN', path: '/dna' }
    ]
  },
  {
    name: 'DỰ ÁN',
    submenu: [
      { label: 'Dự án triển khai', path: '/projects' },
      { label: 'Thư viện kỹ thuật', path: '/library' }
    ]
  },
  { name: 'LIÊN HỆ', path: '/contact' }
];

export default function Header() {
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
      {/* Top Bar */}
      <div className="top-bar">
        <img src="/images/DNA-login.jpeg" alt="Logo" className="logo" />
        <div className="contact-info">
          <div><strong>Hotline:</strong> 0339 773 330</div>
          <div><strong>Email:</strong> vietcarelab@gmail.com</div>
          <div><strong>Địa chỉ:</strong> 388 đường 81, Tân Quy, Q7</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`menu-item ${item.submenu ? 'dropdown' : ''} ${activeMenu === item.name ? 'active' : ''}`}
              onMouseEnter={() => setActiveMenu(item.name)}
              onMouseLeave={() => setActiveMenu('')}
            >
              <span onClick={() => item.path && navigate(item.path)}>{item.name}</span>

              {item.submenu && (
                <ul className="dropdown-menu">
                  {item.submenu.map((sub) => (
                    <li key={sub.label} onClick={() => navigate(sub.path)}>
                      <span>{sub.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {/* Auth Buttons */}
          {!isLogin ? (
            <>
              <li>
                <button className="login-btn" onClick={() => navigate('/login')}>Đăng nhập</button>
              </li>
              <li>
                <Link className="login-btn" to="/register">Đăng ký</Link>
              </li>
            </>
          ) : (
            <>
              <li className="user-info">Xin chào, {name}</li>

              {role === 'ADMIN' && (
                <li>
                  <button className="admin-btn" onClick={() => navigate('/admin')}>
                    <FontAwesomeIcon icon={faCircleUser} /> Trang admin
                  </button>
                </li>
              )}

              {role === 'STAFF' && (
                <li>
                  <Link to="/staff">Trang Nhân Viên</Link>
                </li>
              )}

              {role === 'CUSTOMER' && (
                <li>
                  <button className="payment-btn" onClick={() => navigate('/payment')}>
                    <FontAwesomeIcon icon={faMoneyBill} /> Order
                  </button>
                </li>
              )}

              <li>
                <button className="user-btn" onClick={() => navigate('/user')}>
                  <FontAwesomeIcon icon={faCircleUser} /> Hồ sơ
                </button>
              </li>

              <li>
                <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
