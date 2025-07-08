import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage';
import Login from './components/login/Login';
import Register from './components/register/Register';


import Pricelist from './components/pricelist/Pricelist';
import UserDashboard from './components/dashboards/UserDashboard';
import AppointmentBooking from './components/htmltest/tracking_customer/tracking_user/appointmentBooking';

import CustomerAppointmentList from './components/htmltest/tracking_customer/tracking_user/CustomerApointmentList';
import RevenueManagement from './components/Admin/RevenueManagement';


// Admin layout & pages
import ComHeaderAdmin from './components/Admin/ComHeaderAdmin';
import AdminDashboard from './components/Admin/Accounts';
import Accounts from './components/Admin/Accounts';
// import DashboardPage from './components/admin/DashboardPage';
// import AccountManager from './components/admin/AccountManager';
import FeedBackManagerment from './components/Admin/FeedbackManagement'

import BlogManager from './components/Admin/BlogManager';
import ServiceManager from './components/Admin/ServiceManager';
import SystemSettings from './components/Admin/SystemSetting';
import FacilityScheduleSimple from './components/Admin/FacilityScheduleSimple';

import PublicLayout from './components/PublicLaout/PublicLaout';
import ManagerLayout from './components/Manager/ManagerLayout';
import ManagerStaff from './components/Manager/ManagerStaff';
import CaseTracking from './components/Manager/CaseTracking';

// import SettingsPage from './components/admin/SettingsPage';
// import ChangePassword from './components/admin/ChangePassword';
// import Profile from './components/admin/Profile';

function App() {
  return (
    <BrowserRouter>

      <Routes>
        {/* Public Routes */}
       
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pricelist" element={<Pricelist />} />
      
          <Route path="/user" element={<UserDashboard />} />
        
          <Route path="/tracking_user" element={<AppointmentBooking />} />
          <Route path="/CustomerApointmentList" element={<CustomerAppointmentList />} />
        </Route>

        {/* Admin Routes with layout */}
        <Route path="/admin" element={<ComHeaderAdmin />}>
              <Route path="accounts" element={<Accounts />} />
            <Route path="feedbacks" element={<FeedBackManagerment />} />
            <Route path="Dashboard" element={<RevenueManagement/>}/>
            <Route path="settings" element={<SystemSettings/>} />
            <Route path="services" element={<ServiceManager/>} />
            <Route path="schedules" element={<FacilityScheduleSimple/>} />
            <Route path="blogs" element={<BlogManager/>} />


        {/* //  <Route path="dashboard" element={<DashboardPage />} /> */}
          {/* <Route path="accounts" element={<AccountManager />} />
          
          <Route path="settings" element={<SettingsPage />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="profile" element={<Profile />} /> */}
        </Route>
          <Route path="/manager" element={<ManagerLayout />}>
              <Route path="employees" element={<ManagerStaff />} />
               <Route path="report" element={<FeedBackManagerment />} />
            <Route path="Dashboard" element={<RevenueManagement/>}/>
            <Route path="services" element={<ServiceManager/>} />
            <Route path="tracking" element={<CaseTracking/>} />
             <Route path="schedules" element={<FacilityScheduleSimple/>} />
              <Route path="blogs" element={<BlogManager/>} />
           
        </Route>
        
     
        </Routes> 
    </BrowserRouter>
  );
}

export default App;
