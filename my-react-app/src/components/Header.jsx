import React from 'react';
import './Header.css';
import { useNavigate, Link } from 'react-router-dom';
import apiService from '../service/api';

const Header = () => {
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
      </nav>
    </header>
  );
};

export default Header;
