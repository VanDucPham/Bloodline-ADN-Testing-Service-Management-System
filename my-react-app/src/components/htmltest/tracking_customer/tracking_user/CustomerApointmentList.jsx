// AppointmentList.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck, faMoon, faSun, faPlus, faSearch,
  faCalendarDay, faClock, faEye, faEdit, faTimes,
  faCheckCircle, faExclamationCircle, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import './CustomerApointment.css';
import { useNavigate } from 'react-router-dom';
import apiService from '../../../../service/api';


const AppointmentList = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await apiService.user.getListAppointment()
        console.log(response)
        setAppointments(response)
      } catch (error) {
        console.log("Không lấy dducouocw danh sách app", error)
      }

    }
    fetchService()
  }, []);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);
  const changeTab = (index) => setActiveTab(index);
  const editParticipant = () => showToast('warning', 'Chức năng chỉnh sửa đang phát triển');

  const getStatusClass = (status) => {
    switch (status) {
      case "SCHEDULED": return "status-pending";
      case "COMPLETED": return "status-confirmed";
      case "CANCELLED": return "status-cancelled";
      default: return "";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "SCHEDULED": return "Đã lên lịch";
      case "COMPLETED": return "Hoàn thành";
      case "CANCELLED": return "Đã hủy";
      case "CONFIRMED": return "Đã xác nhận";
      case "IN_PROGRESS": return "Đang xử lý";
      default: return "";
    }


  };
const handleCancelAppointment = async (appointmentId) => {
  try {
    const response = await apiService.user.cancelAppointment(appointmentId);
    
    // DEBUG
    console.log("API Response:", response);

    

    if (response && response.success) {
      showToast('success', response.message || 'Hủy lịch hẹn thành công.');

      // ✅ Cập nhật danh sách trạng thái
      setAppointments((prev) =>
        prev.map((item) =>
          item.appointmentId === appointmentId
            ? { ...item, statusAppointment: 'CANCELLED' }
            : item
        )
      );
    } else {
      showToast('danger', response?.message || 'Hủy lịch hẹn thất bại.');
    }
  } catch (error) {
    console.error("ERROR during cancel:", error);

    const message =
      error.response?.response?.message ||
      error.message ||
      'Lỗi không xác định khi hủy lịch hẹn';

    showToast('danger', message);
  }
};



  return (
    <div className={`appointment-container ${isDarkMode ? "dark" : ""}`}>
      <div className="header">
        <h1 className="title">
          <FontAwesomeIcon icon={faCalendarCheck} />
          <span>Danh sách lịch hẹn</span>
        </h1>
        <div className="controls">
          <button className="theme-toggle" onClick={toggleTheme}>
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button className="add-appointment" onClick={() => navigate('/tracking_user')}>
            <FontAwesomeIcon icon={faPlus} />
            <span>Đặt lịch mới</span>
          </button>
        </div>
      </div>

      <div className="appointment-list">
        {appointments.map((appointment) => (
          <div className="appointment-card" key={appointment.appointmentId}>
            <div className="card-header">
              <div className="card-title">{appointment.serviceName}</div>
              <span className={`card-status ${getStatusClass(appointment.statusAppointment)}`}>
                {getStatusText(appointment.statusAppointment)}
              </span>
            </div>
            <div className="card-detail">
              <div><FontAwesomeIcon icon={faCalendarDay} /> {appointment.date}</div>
              <div><FontAwesomeIcon icon={faClock} /> {appointment.time}</div>
            </div>
            <div className="card-footer">
              <button className="card-btn view" onClick={() => openModal(appointment)}>
                <FontAwesomeIcon icon={faEye} /> Xem
              </button>
              <button className="card-btn edit" onClick={() => showToast('warning', 'Chỉnh sửa lịch hẹn')}>
                <FontAwesomeIcon icon={faEdit} /> Sửa
              </button>
              <button
                className="card-btn cancel"
                onClick={() => handleCancelAppointment(appointment.appointmentId)}
              >
                <FontAwesomeIcon icon={faTimes} /> Hủy
              </button>

            </div>
          </div>
        ))}
      </div>

      {modalOpen && selectedAppointment && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="modal-title">Chi tiết lịch hẹn</h2>
            <div className="tabs">
              <div className={`tab ${activeTab === 0 ? 'active' : ''}`} onClick={() => changeTab(0)}>Thông tin lịch hẹn</div>
              <div className={`tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => changeTab(1)}>Người tham gia & Mẫu</div>
              <div className={`tab ${activeTab === 2 ? 'active' : ''}`} onClick={() => changeTab(2)}>Thanh toán</div>
            </div>

            <div className={`tab-content ${activeTab === 0 ? 'active' : ''}`}>
              <table className="detail-table">
                <tbody>
                  <tr><td>Dịch vụ</td><td>{selectedAppointment.serviceName}</td></tr>
                  <tr><td>Ngày hẹn</td><td>{selectedAppointment.date}</td></tr>
                  <tr><td>Giờ hẹn</td><td>{selectedAppointment.time}</td></tr>
                  <tr><td>Trạng thái</td><td>{getStatusText(selectedAppointment.statusAppointment)}</td></tr>
                  <tr><td>Mã hồ sơ</td><td>{selectedAppointment.caseCode}</td></tr>
                </tbody>
              </table>
            </div>

            <div className={`tab-content ${activeTab === 1 ? 'active' : ''}`}>
              <table className="detail-table">
                <thead>
                  <tr><th>Họ tên</th><th>Số căn cước công dân</th><th>Quan hệ</th><th>Loại mẫu</th><th>Trạng thái mẫu</th><th>Hành động</th></tr>
                </thead>
                <tbody>
                  {selectedAppointment.participantResponseDTOS.map((p, index) => (
                    <tr key={index}>
                      <td>{p.name}</td>
                      <td>{p.citizenId}</td>
                      <td>{p.relationship}</td>
                      <td>{p.sampleDTO?.sampleType || 'Chưa có'}</td>
                      <td>{p.sampleDTO?.status || 'Chưa thu thập'}</td>
                      <td><button className="edit-btn" onClick={editParticipant}>Sửa</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={`tab-content ${activeTab === 2 ? 'active' : ''}`}>
              <table className="detail-table">
                <thead>
                  <tr><th>Mã thanh toán</th><th>Số tiền</th><th>Phương thức</th><th>Trạng thái</th><th>Ngày thanh toán</th></tr>
                </thead>
                <tbody>
                  {selectedAppointment.payment ? (
                    <tr>
                      <td>{selectedAppointment.payment.id}</td>
                      <td>{selectedAppointment.payment.amount}</td>
                      <td>{selectedAppointment.payment.method}</td>
                      <td>{selectedAppointment.payment.status}</td>
                      <td>{selectedAppointment.payment.date}</td>
                    </tr>
                  ) : (
                    <tr><td colSpan="5">Chưa có thông tin thanh toán</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div className={`toast show ${toast.type}`}>
          <FontAwesomeIcon
            icon={toast.type === "danger" ? faTimesCircle : toast.type === "warning" ? faExclamationCircle : faCheckCircle}
          />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
