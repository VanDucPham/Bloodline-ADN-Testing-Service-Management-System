import './App.css';
import Header from './components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCoffee, faHome, faBars, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
<<<<<<< Updated upstream
import Homepage from './Homepage'; // Không cần dấu ngoặc nhọn nếu export default

=======
import Homepage from './Homepage';
>>>>>>> Stashed changes
import Login from './components/login/Login';
import Register from './components/register/Register';
import AdminPage from './components/role/AdminPage';
import AdminDashboard from './components/dashboards/AdminDashboard';
<<<<<<< Updated upstream
=======
import Booking from './components/booking/Booking';
import Payment from './components/payment/Payment';
import Pricelist from './components/pricelist/Pricelist';
import UserDashboard from './components/dashboards/UserDashboard';


>>>>>>> Stashed changes

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPage />} />
<<<<<<< Updated upstream
        <Route path="/admin-dashboard" element={<AdminDashboard activeSection="users" />} />
        
    </Routes>
=======
        <Route path="/admin-dashboard" element={<AdminDashboard activeSection="admin" />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/pricelist" element={<Pricelist />} />
        <Route path="/user" element={<UserDashboard />} />
        
      
      </Routes>
>>>>>>> Stashed changes
    </BrowserRouter>
  );
}

export default App;
