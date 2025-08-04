import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Homepage from './Homepage';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Pricelist from './components/pricelist/Pricelist';
import UserDashboard from './components/dashboards/UserDashboard';
import AppointmentBooking from './components/htmltest/tracking_customer/tracking_user/appointmentBooking';
import BlogDetail from './components/post-detail/BlogDetail';
import DnaPost from './components/dna-testing/dnapost';
import AllPost from './components/allpost/allpost';
import AboutUs from './components/aboutus/AboutUs';
import QuestionADNApp from "./components/questionADN/QuestionADN";
import ConsultationStatus from './components/ConsultationStatus';
import ConsultationDemo from './components/ConsultationDemo';
import ServiceInfo from './components/serviceInfo/ServiceInfo';
import CustomerAppointmentList from './components/htmltest/tracking_customer/tracking_user/CustomerApointmentList';
import RevenueManagement from './components/Admin/RevenueManagement';
import ComHeaderAdmin from './components/Admin/ComHeaderAdmin';
import Accounts from './components/Admin/Accounts';
import FeedBackManagerment from './components/Admin/FeedbackManagement';
import BlogManager from './components/Admin/BlogManager';
import ServiceManager from './components/Admin/ServiceManager';
import SystemSettings from './components/Admin/SystemSetting';
import FacilityScheduleSimple from './components/Admin/FacilityScheduleSimple';
import AllowedAreaManager from './components/Admin/AllowedAreaManager';
import PublicLayout from './components/PublicLaout/PublicLayout';
import ManagerLayout from './components/Manager/ManagerLayout';
import ManagerStaff from './components/Manager/ManagerStaff';
import CaseTracking from './components/Manager/CaseTracking';
import ManagerFeedbackManagement from './components/Manager/ManagerFeedbackManagement';
import BlogList from './components/allpost/BlogList';
import ServiceDetail from './components/pricelist/ServiceDetail';
import MyFeedbackList from './components/feedback/MyFeedbackList';
import StaffAppointments from './components/staffappointments/StaffAppointments';
import CreateAppointment from './components/staffappointments/CreateAppointment';
import PaymentResult from './components/htmltest/tracking_customer/tracking_user/PaymentResult';
// import DistanceCalculator from './components/DistanceCalculator';
import AdminLayout from './components/dashboards/AdminLayout';
import Payment from './components/staffappointments/Payment';
import PaymentManager from './components/Manager/PaymentManager';

function App() {
    return (
        <GoogleOAuthProvider clientId="367800881851-0vas7cftbs3afhorluk2u9ipp4btttm9.apps.googleusercontent.com">
            <BrowserRouter>
                <Routes>

                    {/* Public Routes */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/pricelist" element={<Pricelist />} />
                        <Route path="/service-info" element={<ServiceInfo />} />
                        <Route path="/user" element={<UserDashboard />} />
                        <Route path="/tracking_user" element={<AppointmentBooking />} />
                        <Route path="/CustomerApointmentList" element={<CustomerAppointmentList />} />
                        <Route path="/post" element={<AllPost />} />
                        <Route path="/allpost" element={<AllPost />} />
                        <Route path="/post-detail/:section/:id" element={<BlogDetail />} />
                        <Route path="/post-detail/:id" element={<BlogDetail />} />
                        <Route path="/dna" element={<DnaPost />} />
                        <Route path="/blogList" element={<BlogList />} />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/questionADN" element={<QuestionADNApp />} />
                        <Route path="/consultation-status" element={<ConsultationStatus />} />
                        <Route path="/consultation-demo" element={<ConsultationDemo />} />
                        <Route path="/service/:id" element={<ServiceDetail />} />
                        <Route path="/my-feedback" element={<MyFeedbackList />} />
                        <Route path="/staff/appointments" element={<StaffAppointments />} />
                        <Route path="/staff/appointment/create" element={<CreateAppointment />} />
                        <Route path="/admin-dashboard" element={<AdminLayout activeSection="admin" />} />
                        <Route path="/payment_return" element={<PaymentResult />} />
                        {/* <Route path="/distance" element={<DistanceCalculator />} /> */}
                        <Route path="/payment/:appointmentId" element={<Payment />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route path="/admin" element={<ComHeaderAdmin />}>
                        <Route index element={<RevenueManagement />} />
                        <Route path="accounts" element={<Accounts />} />
                        <Route path="feedbacks" element={<FeedBackManagerment />} />
                        <Route path="dashboard" element={<RevenueManagement />} />
                        <Route path="settings" element={<SystemSettings />} />
                        <Route path="services" element={<ServiceManager />} />
                        <Route path="schedules" element={<FacilityScheduleSimple />} />
                        <Route path="blogs" element={<BlogManager />} />
                        <Route path="areas" element={<AllowedAreaManager />} />
                    </Route>

                    {/* Manager Routes */}
                    <Route path="/manager" element={<ManagerLayout />}>
                        <Route path="employees" element={<ManagerStaff />} />
                        <Route path="report" element={<ManagerFeedbackManagement />} />
                        <Route path="dashboard" element={<RevenueManagement />} />
                        <Route path="services" element={<ServiceManager />} />
                        <Route path="tracking" element={<CaseTracking />} />
                        <Route path="schedules" element={<FacilityScheduleSimple />} />
                        <Route path="blogs" element={<BlogManager />} />
                        <Route path="areas" element={<AllowedAreaManager />} />
                        <Route path="payments" element={<PaymentManager />} />
                    </Route>

                </Routes>
            </BrowserRouter>
        </GoogleOAuthProvider>

    );
}

export default App;