import React, { useState } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCircleUser, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
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
      navigate('/');
    } catch (error) {
      console.error('Lỗi khi đăng xuất', error);
    }
  };

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="top-bar">
        <img src="/logo.png" alt="Vietcare Logo" className="logo" />
        <div className="contact-info">
          <div>Hỗ trợ tư vấn 24/7 <br /><strong>Hoàn toàn MIỄN PHÍ</strong></div>
          <div>0339 773 330</div>
          <div>vietcarelab@gmail.com</div>
          <div>388 đường 81, phường Tân Quy<br />quận 7, TP. Hồ Chí Minh</div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar" role="navigation" aria-label="Main menu">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`menu-item ${item.submenu ? 'dropdown' : ''} ${activeMenu === item.name ? 'active' : ''}`}
              onClick={() => {
                setActiveMenu(item.name);
                if (item.path) navigate(item.path);
              }}
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

          {!isLogin && (
            <>
              <li>
                <button className="login-btn" onClick={() => navigate('/login')}>ĐĂNG NHẬP</button>
              </li>
              <li>
                <Link className="login-btn" to="/register">Đăng ký</Link>
              </li>
            </>
          )}

          {isLogin && (
            <>
              <li className="user-info">Xin chào, {name}</li>

              {role === 'ADMIN' && (
                <li>
                  <button className="admin-btn" onClick={() => navigate('/admin')} title="Trang admin">
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

              {/* Hồ sơ áp dụng cho tất cả role */}
              {['ADMIN', 'STAFF', 'CUSTOMER'].includes(role) && (
                <li>
                  <button className="user-btn" onClick={() => navigate('/user')} title="Hồ sơ cá nhân">
                    <FontAwesomeIcon icon={faCircleUser} /> Hồ sơ
                  </button>
                </li>
              )}

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

export default Header;
