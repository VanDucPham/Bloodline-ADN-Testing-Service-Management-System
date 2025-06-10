import React from 'react';
import { useSearchParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Register.css';

function Register() {
    const
    return (
        <div className="register-bg">
            <form className="register-form">
                <h3>ĐĂNG KÝ</h3>
                <label htmlFor="username">Email</label>
                <input type="email" placeholder="Email" id="email" />               
                <label htmlFor="password">Mật khẩu</label>
                <input type="password" placeholder="Mật khẩu" id="password" />
                <label htmlFor="name">Họ và tên</label>
                <input type="text" placeholder="Họ và tên" id="name" />
                <label htmlFor="phone">Số điện thoại</label>
                <input type="tel" placeholder="Số điện thoại" id="phone" />
                <button type="button">Đăng ký</button>
            </form>
        </div>
    );
}

export default Register;