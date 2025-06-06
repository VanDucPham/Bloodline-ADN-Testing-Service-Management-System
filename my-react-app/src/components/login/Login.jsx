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
            <label htmlFor="username">Username</label>
            <input type="text" placeholder="Email or Phone" id="username" />
            <label htmlFor="password">Password</label>
            <input type="password" placeholder="Password" id="password" />
            <button type="button">Log In</button>
        </form>
        </div>
    );
};



export default Login;