import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Register.css';
import apiService from "../../service/api";



function Register() {
    const [formData, setFormData] = useState({ fullname: '', email: '', password: '', confirmpassword: '', phone: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmpassword) {
            alert("Mật khẩu và Xác nhận mật khẩu không khớp!");
            return;
        }

        try {
            await apiService.auth.register( {
                fullName: formData.fullname,
                email: formData.email,
                password: formData.password,
                phone: formData.phone
            });

            alert("Đăng ký thành công!");
            navigate('/login');
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            alert(error.response?.data?.message || "Đăng ký thất bại!");
        }
    };

    return (
        <div className="register-bg">
            <form className="register-form" onSubmit={handleSubmit}>
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
