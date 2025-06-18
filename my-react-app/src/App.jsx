import './App.css';
import Header from './components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCoffee, faHome, faBars, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Routes, Route, BrowserRouter } from 'react-router-dom';



import Homepage from './Homepage';

import Login from './components/login/Login';
import Register from './components/register/Register';
import AdminPage from './components/role/AdminPage';
import AdminDashboard from './components/dashboards/AdminDashboard';
import Booking from './components/booking/Booking';
import Payment from './components/payment/Payment';
import Pricelist from './components/pricelist/Pricelist';
import UserDashboard from './components/dashboards/UserDashboard';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard activeSection="admin" />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/pricelist" element={<Pricelist />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/dna-testing" element={<DNATestingPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard activeSection="users" />} />
        
        {/* Staff Routes */}
        <Route path="/staff/cases" element={<ComHeaderStaff><Cases /></ComHeaderStaff>} />
        <Route path="/staff/add-case" element={<ComHeaderStaff><AddCase /></ComHeaderStaff>} />
        
        {/* Manager Routes */}
        <Route path="/manager/staff" element={<ComHeaderManager><StaffManagement /></ComHeaderManager>} />
        <Route path="/manager/revenue" element={<ComHeaderManager><RevenueManagement /></ComHeaderManager>} />
        <Route path="/manager/settings" element={<ComHeaderManager><SettingsManagement /></ComHeaderManager>} />
        
        {/* Admin Routes */}
        <Route path="/admin/feedbacks" element={<ComHeaderAdmin><FeedbackManagement /></ComHeaderAdmin>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
