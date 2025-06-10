import React from 'react';
import { useSearchParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Login.css';

function Login() {
    return (
         <div className="login-bg">
        <form className="login-form">
            <h3>Login Here</h3>
            <label htmlFor="username">Tên đăng nhập</label>
            <input type="text" placeholder="Email or Phone" id="username" />
            <label htmlFor="password">Mật khẩu</label>
            <input type="password" placeholder="Mật khẩu" id="password" />
            <button type="button">Đăng nhập</button>
            <p className="register-link">
                Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
        </form>
        </div>
    );
};



export default Login;