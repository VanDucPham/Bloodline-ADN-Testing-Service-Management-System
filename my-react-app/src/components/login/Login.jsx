import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Login.css';
import { apiService, useApi } from '../../service/BaseApiService';

function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await 
                apiService.post('auth/login',
                {
                    email: formData.username,
                    password: formData.password
                })
            ;
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className="login-bg">
            <form className="login-form" onSubmit={handleSubmit}>
                <h3>Login Here</h3>
                <label htmlFor="username">Tên đăng nhập</label>
                <input
                    type="text"
                    placeholder="Email or Phone"
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <label htmlFor="password">Mật khẩu</label>
                <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="submit">Log In</button>
                <p className="register-link">
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
