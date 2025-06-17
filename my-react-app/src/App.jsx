import './App.css';
import Header from './components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCoffee, faHome, faBars, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Homepage from './Homepage'; // Không cần dấu ngoặc nhọn nếu export default

import Login from './components/login/Login';
import Register from './components/register/Register';
import AdminPage from './components/role/AdminPage';
import AdminDashboard from './components/dashboards/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard activeSection="users" />} />
        
    </Routes>
    </BrowserRouter>
  );
}

export default App;
