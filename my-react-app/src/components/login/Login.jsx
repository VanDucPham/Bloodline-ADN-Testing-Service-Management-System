import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import apiService from "../../service/api";


import './Login.css';

function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState('');

    const navigate = useNavigate();

    // Validate email và password
    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        // Check email định dạng
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.username) {
            tempErrors.username = "Email không được để trống";
            isValid = false;
        } else if (!emailRegex.test(formData.username)) {
            tempErrors.username = "Email không đúng định dạng";
            isValid = false;
        }

        // Check mật khẩu
        if (!formData.password) {
            tempErrors.password = "Mật khẩu không được để trống";
            isValid = false;
        } else if (formData.password.length < 6) {
            tempErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError(''); // Reset lỗi login

        if (!validate()) return;

        try {
            const response = await apiService.auth.login( {
                email: formData.username,
                password: formData.password
            });
                
          console.log(response)
       

localStorage.setItem('userInfo', JSON.stringify(response));

         
            // Nếu login thành công thì chuyển trang
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);

            // Hiển thị lỗi từ BE trả về
            const errorMsg = error.response?.data?.message || "Sai tài khoản hoặc mật khẩu";
            setLoginError(errorMsg);
        }
    };

    return (
        <div className="login-bg">
            <form className="login-form" onSubmit={handleSubmit}>
                <h3>Login Here</h3>

                {loginError && <p className="error">{loginError}</p>}

                <label htmlFor="username">Email</label>
                <input
                    type="text"
                    placeholder="Email"
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                {errors.username && <span className="error">{errors.username}</span>}

                <label htmlFor="password">Mật khẩu</label>
                <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                {errors.password && <span className="error">{errors.password}</span>}

                <button type="submit">Log In</button>
                <p className="register-link">
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
