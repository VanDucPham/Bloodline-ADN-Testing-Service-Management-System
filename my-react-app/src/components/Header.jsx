import React, { useState } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [activeMenu, setActiveMenu] = useState('');
  const navigate = useNavigate();

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
  };

  return (
    <header className="header">
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
              onClick={() => handleMenuClick(item.name)}
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
            <button className='login-btn' onClick={() => navigate('/register')} >Register</button>
          </li> <FontAwesomeIcon icon={faMagnifyingGlass} /><FontAwesomeIcon icon={faGoogle} />

          <li>
            <button className="admin-btn" onClick={() => navigate('/admin')}>
              VÀO TRANG ADMIN
            </button>
          </li>


        </ul>
      </nav>
    </header>
  );
}

export default Header;
