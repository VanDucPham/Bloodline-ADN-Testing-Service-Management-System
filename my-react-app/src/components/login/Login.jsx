import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Login.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                // Lưu token vào localStorage
                localStorage.setItem("token", token);

                // Chuyển hướng (navigate)
                navigate("/dashboard"); // hoặc trang nào đó
            } else {
                alert("Đăng nhập thất bại!");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Lỗi kết nối!");
        }
    };

    return (
        <div className="login-bg">
            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                <h3>Login Here</h3>
                <label htmlFor="username">Email</label>
                <input
                    type="text"
                    placeholder="Email"
                    id="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={handleLogin}>Log In</button>
            </form>
        </div>
    );
}

export default Login;
