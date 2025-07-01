import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck, faMoon, faSun, faPlus, faSearch,
  faCalendarDay, faClock, faEye, faEdit, faTimes,
  faCheckCircle, faExclamationCircle, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import './CustomerApointment.css';

const AppointmentList = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const appointments = [
    {
      id: 1,
      service: "Khám tổng quát",
      date: "2024-07-15",
      time: "09:00",
      status: "confirmed",
      note: "Khám sức khỏe định kỳ"
    },
    {
      id: 2,
      service: "Tư vấn dinh dưỡng",
      date: "2024-07-18",
      time: "14:00",
      status: "pending",
      note: "Tư vấn chế độ ăn"
    },
    {
      id: 3,
      service: "Chăm sóc da",
      date: "2024-07-20",
      time: "10:30",
      status: "cancelled",
      note: "Hủy do bận công tác"
    }
  ];

  const participants = [
    { name: "Nguyễn Văn A", relationship: "Cha", sample: "Mẫu máu", status: "Đã thu thập" },
    { name: "Nguyễn Thị B", relationship: "Mẹ", sample: "Mẫu niêm mạc", status: "Chưa thu thập" },
    { name: "Nguyễn Văn C", relationship: "Con", sample: "Mẫu tóc", status: "Đang xử lý" }
  ];

  const payments = [
    { id: "PAY-001", amount: "5,000,000 VND", method: "Chuyển khoản", status: "Thành công", date: "2024-07-10" },
    { id: "PAY-002", amount: "2,000,000 VND", method: "Tiền mặt", status: "Thành công", date: "2024-07-12" }
  ];

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const changeTab = (index) => {
    setActiveTab(index);
  };

  const editParticipant = () => {
    showToast('warning', 'Chức năng chỉnh sửa đang được phát triển');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed": return "status-confirmed";
      case "pending": return "status-pending";
      case "cancelled": return "status-cancelled";
      default: return "";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed": return "Đã xác nhận";
      case "pending": return "Chờ xác nhận";
      case "cancelled": return "Đã hủy";
      default: return "";
    }
  };

  return (
    <div className={`appointment-container ${isDarkMode ? "dark" : ""}`}>
      {/* Header */}
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
          <button className="add-appointment">
            <FontAwesomeIcon icon={faPlus} />
            <span>Đặt lịch mới</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-filter">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} />
          <input type="text" placeholder="Tìm kiếm lịch hẹn..." />
        </div>
        <div className="filter-box">
          <select>
            <option value="all">Tất cả trạng thái</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Appointment List */}
      <div className="appointment-list">
        {appointments.map((appointment) => (
          <div className="appointment-card" key={appointment.id}>
            <div className="card-header">
              <div className="card-title">{appointment.service}</div>
              <span className={`card-status ${getStatusClass(appointment.status)}`}>
                {getStatusText(appointment.status)}
              </span>
            </div>
            <div className="card-detail">
              <div><FontAwesomeIcon icon={faCalendarDay} /> {appointment.date}</div>
              <div><FontAwesomeIcon icon={faClock} /> {appointment.time}</div>
            </div>
            <div className="card-footer">
              <button className="card-btn view" onClick={openModal}>
                <FontAwesomeIcon icon={faEye} /> Xem
              </button>
              <button
                className="card-btn edit"
                onClick={() => showToast('warning', 'Chỉnh sửa lịch hẹn')}
              >
                <FontAwesomeIcon icon={faEdit} /> Sửa
              </button>
              <button
                className="card-btn cancel"
                onClick={() => showToast('danger', 'Đã hủy lịch hẹn')}
              >
                <FontAwesomeIcon icon={faTimes} /> Hủy
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <h2 className="modal-title">Chi tiết lịch hẹn</h2>

            {/* Tabs */}
            <div className="tabs">
              <div
                className={`tab ${activeTab === 0 ? 'active' : ''}`}
                onClick={() => changeTab(0)}
              >
                Thông tin lịch hẹn
              </div>
              <div
                className={`tab ${activeTab === 1 ? 'active' : ''}`}
                onClick={() => changeTab(1)}
              >
                Người tham gia & Mẫu
              </div>
              <div
                className={`tab ${activeTab === 2 ? 'active' : ''}`}
                onClick={() => changeTab(2)}
              >
                Thanh toán
              </div>
            </div>

            {/* Tab Content */}
            <div className={`tab-content ${activeTab === 0 ? 'active' : ''}`}>
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>Thông tin</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Dịch vụ</td>
                    <td>Khám tổng quát</td>
                  </tr>
                  <tr>
                    <td>Ngày hẹn</td>
                    <td>2024-07-15</td>
                  </tr>
                  <tr>
                    <td>Giờ hẹn</td>
                    <td>09:00</td>
                  </tr>
                  <tr>
                    <td>Trạng thái</td>
                    <td>Đã xác nhận</td>
                  </tr>
                  <tr>
                    <td>Ghi chú</td>
                    <td>Khám sức khỏe định kỳ</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`tab-content ${activeTab === 1 ? 'active' : ''}`}>
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Mối quan hệ</th>
                    <th>Loại mẫu</th>
                    <th>Trạng thái mẫu</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant, index) => (
                    <tr key={index}>
                      <td>{participant.name}</td>
                      <td>{participant.relationship}</td>
                      <td>{participant.sample}</td>
                      <td>{participant.status}</td>
                      <td>
                        <button className="edit-btn" onClick={editParticipant}>
                          Sửa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={`tab-content ${activeTab === 2 ? 'active' : ''}`}>
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>Mã thanh toán</th>
                    <th>Số tiền</th>
                    <th>Phương thức</th>
                    <th>Trạng thái</th>
                    <th>Ngày thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr key={index}>
                      <td>{payment.id}</td>
                      <td>{payment.amount}</td>
                      <td>{payment.method}</td>
                      <td>{payment.status}</td>
                      <td>{payment.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast show ${toast.type === "danger" ? "danger" : toast.type === "warning" ? "warning" : ""}`}>
          <FontAwesomeIcon
            icon={
              toast.type === "danger"
                ? faTimesCircle
                : toast.type === "warning"
                  ? faExclamationCircle
                  : faCheckCircle
            }
          />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
