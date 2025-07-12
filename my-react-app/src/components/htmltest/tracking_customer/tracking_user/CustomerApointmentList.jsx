import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck, faMoon, faSun, faPlus, faCalendarDay, faClock, faEye, faTimes,
  faCheckCircle, faExclamationCircle, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import './CustomerApointment.css';
import { useNavigate } from 'react-router-dom';
import apiService from '../../../../service/api';
import Feedback from '../../../feedback/FeedBack';

const AppointmentList = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackAppointment, setFeedbackAppointment] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchService = async () => {
      try {
        const response = await apiService.user.getListAppointment();
        setAppointments(response);
        console.log(response)
      } catch (error) {
        console.log("Không lấy được danh sách lịch hẹn", error);
      }
    };
    fetchService();
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

  const getStatusClass = (status) => {
    switch (status) {
      case "SCHEDULED": return "status-pending";
      case "COMPLETED": return "status-done";
      case "CANCELLED": return "status-cancelled";
      case "CONFIRMED": return "status-confirmed";
      case "IN_PROGRESS": return "status-inprocess";
      case "HOME_DELIVERY": return "status-delivery";
      case "HOME_COLLECTION": return "status-collection";
      case "SELF_DROP_OFF": return "status-off";
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
      case "HOME_DELIVERY": return "Nhân viên đến lấy mẫu";
      case "HOME_COLLECTION": return "Tự lấy mẫu";
      case "SELF_DROP_OFF": return "Gửi mẫu tại cơ sở";
      default: return "";
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await apiService.user.cancelAppointment(appointmentId);
      if (response && response.success) {
        showToast('success', response.message || 'Hủy lịch hẹn thành công.');
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
      const message =
        error.response?.response?.message ||
        error.message ||
        'Lỗi không xác định khi hủy lịch hẹn';
      showToast('danger', message);
    }
  };

  const handleSaveParticipant = async () => {
    try {
      const response = await apiService.user.updateParticipant(editingParticipant.participantId, {
        name: editingParticipant.name,
        citizenId: editingParticipant.citizenId,
        relationShip: editingParticipant.relationship,
        sample: {
          sampleType: editingParticipant.sampleDTO?.sampleType
        }
      });

      if (response.success) {
        showToast('success', response.message || 'Cập nhật thành công');
        closeModal();
      } else {
        showToast('danger', response.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Lỗi không xác định khi cập nhật';
      showToast('danger', message);
    }
    setSelectedAppointment((prev) => {
      if (!prev) return prev;
      const updatedParticipants = prev.participantResponseDTOS.map((item) =>
        item.participantId === editingParticipant.participantId
          ? { ...item, ...editingParticipant }
          : item
      );
      return { ...prev, participantResponseDTOS: updatedParticipants };
    });
  };
const filteredAppointments = appointments.filter((a) =>
  filterStatus === "ALL" ? true : a.statusAppointment === filterStatus
);

  const openEditParticipantModal = (participant) => {
    setEditingParticipant({
      ...participant,
      sampleDTO: participant.sampleDTO || {}
    });
    setShowEditModal(true);
  };

  return (
    <div className={`appointment-container ${isDarkMode ? "dark" : ""}`}>
      <div className="header">
        <h1 className="title">
          <FontAwesomeIcon icon={faCalendarCheck} />
          <span>Danh sách lịch hẹn</span>
        </h1>
        <div className="filter-bar">
  <label>Trạng thái:</label>
  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
    <option value="ALL">Tất cả</option>
    <option value="SCHEDULED">Đã lên lịch</option>
    <option value="CONFIRMED">Đã xác nhận</option>
    <option value="COMPLETED">Hoàn thành</option>
    <option value="CANCELLED">Đã hủy</option>
  </select>
</div>

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
  {filteredAppointments.map((appointment) => (
   <div className="appointment-card" key={appointment.appointmentId}>
            <div className="card-header">
              <div>
                <div className="card-title">{appointment.serviceName}</div>
                <span className={`card-status ${getStatusClass(appointment.statusAppointment)}`}>
                  {getStatusText(appointment.statusAppointment)}
                </span>
              </div>
              <div>
                <span>{getStatusText(appointment.delivery_method)} </span>
              </div>
            </div>
            <div className="card-detail">
              <div><FontAwesomeIcon icon={faCalendarDay} /> {appointment.date}</div>
              <div><FontAwesomeIcon icon={faClock} /> {appointment.time}</div>
            </div>
            <div className="card-footer">
              <button className="card-btn view" onClick={() => openModal(appointment)}>
                <FontAwesomeIcon icon={faEye} /> Xem
              </button>
              {appointment.statusAppointment === "SCHEDULED" && (
                <button
                  className="card-btn cancel"
                  onClick={() => handleCancelAppointment(appointment.appointmentId)}
                >
                  <FontAwesomeIcon icon={faTimes} /> Hủy
                </button>
              )}
              {appointment.appointmentStatus === "COMPLETED" && (
                <button
                  className="card-btn feedback"
                  onClick={() => {
                    setFeedbackAppointment(appointment);
                    setShowFeedbackModal(true);
                  }}
                >
                  <FontAwesomeIcon icon={faCheckCircle} /> Gửi phản hồi
                </button>
              )}
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
                  <tr><td>Trạng thái lịch hẹn</td><td>{getStatusText(selectedAppointment.statusAppointment)}</td></tr>
                  {selectedAppointment.delivery_method === "HOME_DELIVERY" && (
                    <tr><td>Trạng thái lấy mẫu tại nhà:</td><td>Nhân viên đang đến</td></tr>
                  )}
                  {selectedAppointment.delivery_method === "HOME_COLLECTION" && (
                    <tr><td>Trạng thái kit:</td><td>Kit đã được đang được gửi đến</td></tr>
                  )}
                  <tr>
  <td>Kết luận xét nghiệm</td>
  <td style={{ fontWeight: 'bold', color: selectedAppointment.result ? '#2c3e50' : '#999' }}>
    {selectedAppointment.result || 'Chưa có kết quả'}
  </td>
</tr>

                  <tr><td>Mã hồ sơ</td><td>{selectedAppointment.caseCode}</td></tr>
                </tbody>
              </table>
            </div>

            <div className={`tab-content ${activeTab === 1 ? 'active' : ''}`}>
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Số căn cước công dân</th>
                    <th>Quan hệ</th>
                    <th>Loại mẫu</th>
                    <th>Trạng thái mẫu</th>
                    <th>Kết quả</th>
                      <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAppointment.participantResponseDTOS.map((p, index) => (
                    <tr key={index}>
                      <td>{p.name}</td>
                      <td>{p.citizenId}</td>
                      <td>{p.relationship}</td>
                      <td>{p.sampleDTO?.sampleType || 'Chưa có'}</td>
                      <td>{p.sampleDTO?.status || 'Chưa thu thập'}</td>
                      <td>chưa có kết quả</td>
                      {selectedAppointment.delivery_method ==="HOME_COLLECTION" && selectedAppointment.statusAppointment ==="SCHEDULED"&&(

                           <td>
                        <button
                          className="edit-btn"
                          onClick={() => openEditParticipantModal(p)}
                        >
                          Sửa
                        </button>
                      </td>
                      ) }
                     
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

      {showEditModal && editingParticipant && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <h3>Chỉnh sửa người tham gia</h3>
            <label>Họ tên:</label>
            <input
              value={editingParticipant.name}
              onChange={(e) =>
                setEditingParticipant({ ...editingParticipant, name: e.target.value })
              }
            />
            <label>Số CCCD:</label>
            <input
              value={editingParticipant.citizenId}
              onChange={(e) =>
                setEditingParticipant({ ...editingParticipant, citizenId: e.target.value })
              }
            />
            <label>Quan hệ:</label>
            <input
              value={editingParticipant.relationship}
              onChange={(e) =>
                setEditingParticipant({ ...editingParticipant, relationship: e.target.value })
              }
            />
            <label>Loại mẫu:</label>
            <input
              value={editingParticipant.sampleDTO.sampleType || ''}
              onChange={(e) =>
                setEditingParticipant({
                  ...editingParticipant,
                  sampleDTO: { ...editingParticipant.sampleDTO, sampleType: e.target.value }
                })
              }
            />
            <div className="modal-actions">
              <button onClick={() => setShowEditModal(false)}>Hủy</button>
              <button onClick={handleSaveParticipant}>Lưu</button>
            </div>
          </div>
        </div>
      )}

      {showFeedbackModal && feedbackAppointment && (
        <div className="modal-overlay" onClick={() => setShowFeedbackModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowFeedbackModal(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="modal-title">Gửi phản hồi cho lịch hẹn</h2>
            <Feedback
              appointment_id={feedbackAppointment.appointmentId}
              service_id={feedbackAppointment.serviceId}
              user_id={feedbackAppointment.userId}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
