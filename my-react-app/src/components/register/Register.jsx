import React from 'react';
import { useSearchParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Register.css';

function Register() {
    return (
        <div className="register-bg">
            <form className="register-form">
                <h3>ĐĂNG KÝ</h3>
                <label htmlFor="username">Tên đăng nhập</label>
                <input type="text" placeholder="Email hoặc Số điện thoại" id="username" />               
                <label htmlFor="password">Mật khẩu</label>
                <input type="password" placeholder="Mật khẩu" id="password" />
                <label htmlFor="confirm-password">Xác nhận mật khẩu </label>
                <input type="password" placeholder="Xác nhận mật khẩu " id="confirm-password" />
                <button type="button">Register</button>
            </form>
        </div>
    );
}

export default Register;