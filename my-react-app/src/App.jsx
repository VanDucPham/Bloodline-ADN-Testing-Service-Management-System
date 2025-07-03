// import './App.css';
// import Header from './components/Header';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser, faCoffee, faHome, faBars, faCheck } from '@fortawesome/free-solid-svg-icons';
// import { Routes, Route, BrowserRouter } from 'react-router-dom';



// import Homepage from './Homepage';

// import Login from './components/login/Login';
// import Register from './components/register/Register';
// import AdminPage from './components/role/AdminPage';
// import AdminDashboard from './components/dashboards/AdminDashboard';

// import Booking from './components/booking/Booking';
// import Payment from './components/payment/Payment';
// import Pricelist from './components/pricelist/Pricelist';
// import UserDashboard from './components/dashboards/UserDashboard';
// import AppointmentBooking from './components/htmltest/tracking_customer/tracking_user/appointmentBooking';
// import StaffAppointments from './components/staffappointments/StaffAppointments';




// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
    
//         <Route path="/" element={<Homepage />}/>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/admin" element={<AdminPage />} />

//         <Route path="/admin-dashboard" element={<AdminDashboard activeSection="admin" />} />
//         <Route path="/booking" element={<Booking />} />
//         <Route path="/payment" element={<Payment />} />
//         <Route path="/pricelist" element={<Pricelist />} />
//         <Route path="/user" element={<UserDashboard />} />
//         <Route path="/tracking_user" element={<AppointmentBooking />}/>
//         <Route path="/staff/appointments" element={<StaffAppointments />} />
        
      
//       </Routes>

//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Homepage from './Homepage';
import Login from './components/login/Login';
import Register from './components/register/Register';
import AdminPage from './components/role/AdminPage';
import AdminDashboard from './components/dashboards/AdminDashboard';
import Booking from './components/booking/Booking';
import Payment from './components/payment/Payment';
import Pricelist from './components/pricelist/Pricelist';
import UserDashboard from './components/dashboards/UserDashboard';
import AppointmentBooking from './components/htmltest/tracking_customer/tracking_user/appointmentBooking';
import StaffAppointments from './components/staffappointments/StaffAppointments';
import CreateAppointment from './components/staffappointments/CreateAppointment';
import TimeSlotLimitAdmin from './page/admin/TimeSlotLimitAdmin';
import CustomerAppointmentList from './components/htmltest/tracking_customer/tracking_user/CustomerApointmentList';
import RevenueManagement from './page/manager/revenue/RevenueManagement'

function App() {
  return (
    <BrowserRouter>
      <Header /> {/* Luôn nằm ngoài Routes */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard activeSection="admin" />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/pricelist" element={<Pricelist />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/tracking_user" element={<AppointmentBooking />} />
        <Route path="/staff/appointment" element={<StaffAppointments />} />
        <Route path="/staff/appointment/create" element={<CreateAppointment />} />
        <Route path="/admin/time-slot-limit" element={<TimeSlotLimitAdmin />} />
        <Route path="/CustomerApointmentList" element={<CustomerAppointmentList/>}/>
        <Route path="/RevenueManagerment" element ={<RevenueManagement/>}/>

        {/* Thêm các route khác nếu cần */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
