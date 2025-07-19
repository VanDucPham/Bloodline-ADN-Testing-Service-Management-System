import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck, faMoon, faSun, faPlus, faCalendarDay, faClock, faEye, faTimes,
  faCheckCircle, faExclamationCircle, faTimesCircle, faFilter, faUserCircle, faMoneyCheckAlt, faCreditCard
} from '@fortawesome/free-solid-svg-icons';
import './CustomerApointment.css';
import { useNavigate } from 'react-router-dom';
import apiService from '../../../../service/api';
import Feedback from '../../../feedback/FeedBack';

// Đặt các hàm và biến mẫu lên trước component
const sampleAvatars = [
  'https://i.pravatar.cc/60?img=1',
  'https://i.pravatar.cc/60?img=2',
  'https://i.pravatar.cc/60?img=3',
  'https://i.pravatar.cc/60?img=4',
  'https://i.pravatar.cc/60?img=5',
];
const sampleNames = [
  'Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E'
];
const sampleReviews = [
  { name: 'Nguyễn Văn A', avatar: sampleAvatars[0], rating: 5, comment: 'Dịch vụ tốt, nhân viên thân thiện.' },
  { name: 'Trần Thị B', avatar: sampleAvatars[1], rating: 4, comment: 'Thủ tục nhanh, giá hợp lý.' },
  { name: 'Lê Văn C', avatar: sampleAvatars[2], rating: 5, comment: 'Hỗ trợ tận tình, kết quả rõ ràng.' },
];
const getStats = (appointments) => {
  return {
    total: appointments.length,
    completed: appointments.filter(a => a.statusAppointment === 'COMPLETED').length,
    scheduled: appointments.filter(a => a.statusAppointment === 'SCHEDULED').length,
    cancelled: appointments.filter(a => a.statusAppointment === 'CANCELLED').length,
  };
};
const getUpcoming = (appointments) => {
  return [...appointments]
    .filter(a => a.statusAppointment !== 'COMPLETED' && a.statusAppointment !== 'CANCELLED')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);
};
const PAGE_SIZE = 6;

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
  //lấy kết quả
  const [selectedAppointmentResult, setSelectedAppointmentResult] = useState(null);
  // Pagination state
  const [page, setPage] = useState(1);
  const stats = getStats(appointments);
  const upcoming = getUpcoming(appointments);
  // Filtered appointments phải khai báo ngay sau khi có appointments, trước khi dùng ở các biến khác
  const filteredAppointments = appointments.filter((a) =>
    filterStatus === "ALL" ? true : a.statusAppointment === filterStatus
  );
  // Card data phân trang
  const pagedAppointments = filteredAppointments.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

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
        showToast('danger', response.message || 'Hủy lịch hẹn thất bại.');
      }
    } catch (error) {
      const message =
        error.response?.response?.message ||
        error.message ||
        'Lỗi không xác định khi hủy lịch hẹn';
      showToast('danger', message);
    }
  };

  const handleConfirmKitReceived = async (appointmentId) => {
    try {
      // Giữ nguyên trạng thái appointment, chỉ cập nhật collection status
      const currentStatus = selectedAppointment.statusAppointment;
      console.log('🔍 Debug - Calling API:', {
        appointmentId,
        currentStatus,
        collectionStatus: 'ARRIVED'
      });
      
      const response = await apiService.user.updateAppointmentStatusAndCollectionStatus(
        appointmentId, 
        currentStatus, 
        'ARRIVED'
      )      
      // Nếu API call thành công (không throw error), coi như thành công
      showToast('success', 'Đã xác nhận nhận kit thành công!');
      
      // Cập nhật trạng thái trong danh sách
      setAppointments((prev) =>
        prev.map((item) =>
          item.appointmentId === appointmentId
            ? { ...item, collection_Status: 'ARRIVED' }
            : item
        )
      );
      
      // Cập nhật trạng thái trong modal nếu đang mở
      if (selectedAppointment && selectedAppointment.appointmentId === appointmentId) {
        setSelectedAppointment(prev => ({
          ...prev,
          collection_Status: 'ARRIVED'
        }));
      }
      
    } catch (error) {
      console.error('❌ Debug - API Error:', error);
      const message =
        error.response?.data?.message ||
        error.message ||
        'Lỗi không xác định khi xác nhận nhận kit';
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

  const openEditParticipantModal = (participant) => {
    setEditingParticipant({
      ...participant,
      sampleDTO: participant.sampleDTO || {}
    });
    setShowEditModal(true);
  };

  // useEffect mới để lấy kết quả khi selectedAppointment thay đổi
  useEffect(() => {
    if (selectedAppointment) {
      const fetchResult = async () => {
        try {
          const result = await apiService.user.getResult(selectedAppointment.appointmentId);
          setSelectedAppointmentResult(result);
        } catch (error) {
          setSelectedAppointmentResult(null);
          console.error('Lỗi khi lấy kết quả:', error);
        }
      };
      fetchResult();
    } else {
      setSelectedAppointmentResult(null);
    }
  }, [selectedAppointment]);

  // Fetch kết quả cho lịch hẹn đã chọn
  const fetchResultForAppointment = async (appointmentId) => {
    try {
      const result = await apiService.user.getResult(appointmentId);
      setSelectedAppointmentResult(result);
    } catch (error) {
      setSelectedAppointmentResult(null);
      console.error('Lỗi khi lấy kết quả:', error);
    }
  };

  return (
    <div className={`appointment-layout`}>
      <div className={`appointment-container ${isDarkMode ? "dark" : ""}`}> 
        <div className="header">
          <h1 className="title">
            <FontAwesomeIcon icon={faCalendarCheck} />
            <span>Danh sách lịch hẹn</span>
          </h1>
          <div className="filter-bar">
            <label><FontAwesomeIcon icon={faFilter} style={{marginRight:6}}/>Trạng thái:</label>
            <select value={filterStatus} onChange={(e) => {setFilterStatus(e.target.value); setPage(1);}}>
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
        <div className="appointment-list grid-2col">
          {pagedAppointments.map((appointment, idx) => {
            // Dữ liệu mẫu avatar, tên
            const avatar = sampleAvatars[idx % sampleAvatars.length];
            const name = sampleNames[idx % sampleNames.length];
            // Kiểm tra trạng thái thanh toán thực từ paymentDTO
            const isPaid = appointment.paymentDTO && appointment.paymentDTO.paymentStatus === "COMPLETED";
            return (
              <div className="appointment-card fade-in-card" key={appointment.appointmentId} style={{animationDelay: `${idx * 80}ms`}}>
                <div className="card-header">
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <img src={avatar} alt={name} className="card-avatar" />
                    <div>
                      <div className="card-title">{appointment.serviceName}</div>
                      <div className="card-customer">{name}</div>
                    </div>
                  </div>
                  <span className={`card-status ${getStatusClass(appointment.statusAppointment)}`}>
                    <FontAwesomeIcon icon={faCheckCircle} style={{marginRight:4}} />
                    {getStatusText(appointment.statusAppointment)}
                  </span>
                </div>
                <div className="card-detail">
                  <div><FontAwesomeIcon icon={faCalendarDay} /> {appointment.date}</div>
                  <div><FontAwesomeIcon icon={faClock} /> {appointment.time}</div>
                  <div className={`card-payment ${isPaid ? 'paid' : 'unpaid'}`}>
                    <FontAwesomeIcon icon={isPaid ? faCreditCard : faMoneyCheckAlt} style={{marginRight:4}} />
                    {isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </div>
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
                  {appointment.result && appointment.result.trim() !== '' && (
                    <button
                      className="card-btn feedback"
                      onClick={() => {
                        setFeedbackAppointment(appointment);
                        setShowFeedbackModal(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} /> Feedback
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Pagination */}
        <div className="pagination-bar compact">
          {Array.from({length: Math.ceil(filteredAppointments.length/PAGE_SIZE)}).map((_,i) => (
            <button key={i} className={`pagination-btn compact${page===i+1?' active':''}`} onClick={()=>setPage(i+1)}>{i+1}</button>
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
                <div className={`tab ${activeTab === 3 ? 'active' : ''}`} onClick={() => changeTab(3)}>Chi tiết kết quả</div>
              </div>

              <div className={`tab-content ${activeTab === 0 ? 'active' : ''}`}>
                <table className="detail-table">
                  <tbody>
                    <tr><td>Dịch vụ</td><td>{selectedAppointment.serviceName}</td></tr>
                    <tr><td>Ngày hẹn</td><td>{selectedAppointment.date}</td></tr>
                    <tr><td>Giờ hẹn</td><td>{selectedAppointment.time}</td></tr>
                    <tr><td>Trạng thái lịch hẹn</td><td>{getStatusText(selectedAppointment.statusAppointment)}</td></tr>
                    {selectedAppointment.delivery_method === "HOME_DELIVERY" && (
                      <tr><td>Trạng thái lấy mẫu tại nhà:</td><td>{selectedAppointment.collection_Status || 'Chưa có thông tin'}</td></tr>
                    )}
                    {selectedAppointment.delivery_method === "HOME_COLLECTION" && (
                      <tr>
                        <td>Trạng thái kit:</td>
                        <td>
                          {selectedAppointment.collection_Status || 'Chưa có thông tin'}
                          {selectedAppointment.collection_Status === "TRAVELING" && (
                            <button
                              onClick={() => handleConfirmKitReceived(selectedAppointment.appointmentId)}
                              style={{ 
                                backgroundColor: '#52c41a', 
                                color: 'white', 
                                border: 'none', 
                                padding: '4px 8px', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                fontSize: '12px',
                                marginLeft: '8px'
                              }}
                            >
                              ✅ Xác nhận nhận kit
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td>Kết luận xét nghiệm</td>
                      <td style={{ fontWeight: 'bold', color: selectedAppointment.result ? '#2c3e50' : '#999' }}>
                        {selectedAppointmentResult?.resultValue  || 'Chưa có kết quả'}
                      </td>
                    </tr>
                    <tr><td>Mã hồ sơ</td><td>{selectedAppointment.caseCode}</td></tr>
                  </tbody>
                </table>
                
                
                {selectedAppointment.result && selectedAppointment.result.trim() !== '' && (
                  <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <button
                      className="card-btn feedback"
                      onClick={() => {
                        setFeedbackAppointment(selectedAppointment);
                        setShowFeedbackModal(true);
                        closeModal();
                      }}
                      style={{ 
                        backgroundColor: '#52c41a', 
                        color: 'white', 
                        border: 'none', 
                        padding: '8px 16px', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} /> Gửi phản hồi
                    </button>
                  </div>
                )}
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
                        <td>{p.sampleDTO?.result || 'chưa có kết quả'}</td>
                        {(selectedAppointment.delivery_method ==="HOME_COLLECTION" && selectedAppointment.statusAppointment ==="SCHEDULED")&&(
                          <td>
                            <button
                              className="edit-btn"
                              onClick={() => openEditParticipantModal(p)}
                            >
                              Sửa
                            </button>
                          </td>
                        )}
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
                    {selectedAppointment.paymentDTO ? (
                      <tr>
                        <td>{selectedAppointment.paymentDTO.paymentID}</td>
                        <td>
                          {selectedAppointment.paymentDTO.paymentAmount ? selectedAppointment.paymentDTO.paymentAmount.toLocaleString('vi-VN') : '0'} ₫
                        </td>
                        <td>{selectedAppointment.paymentDTO.paymentMethod}</td>
                        <td>{selectedAppointment.paymentDTO.paymentStatus}</td>
                        <td>{selectedAppointment.paymentDTO.paymentDate}</td>
                      </tr>
                    ) : (
                      <tr><td colSpan="5">Chưa có thông tin thanh toán</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className={`tab-content ${activeTab === 3 ? 'active' : ''}`}>
                {selectedAppointmentResult ? (
                  <table className="detail-table">
                    <tbody>
                      <tr>
                        <td>Kết quả</td>
                        <td>{selectedAppointmentResult.resultValue || 'Không có dữ liệu'}</td>
                      </tr>
                      <tr>
                        <td>Ghi chú</td>
                        <td>{selectedAppointmentResult.notes || '-'}</td>
                      </tr>
                      <tr>
                        <td>Ngày phân tích</td>
                        <td>{selectedAppointmentResult.resultDate ? new Date(selectedAppointmentResult.resultDate).toLocaleString() : '-'}</td>
                      </tr>
                      <tr>
                        <td>Trạng thái</td>
                        <td>{selectedAppointmentResult.status || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p>Chưa có dữ liệu kết quả.</p>
                )}
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
              {console.log('feedbackAppointment:', feedbackAppointment)}
              <Feedback
                appointment_id={feedbackAppointment.appointmentId}
                service_id={feedbackAppointment.serviceId}
                user_id={feedbackAppointment.userId}
              />
            </div>
          </div>
        )}
      </div>
      {/* SIDEBAR */}
      <aside className="appointment-sidebar">
        <div className="sidebar-block">
          <h3 className="sidebar-title">Thống kê nhanh</h3>
          <ul className="stat-list">
            <li><b>Tổng lịch hẹn:</b> {stats.total}</li>
            <li><b>Hoàn thành:</b> {stats.completed}</li>
            <li><b>Đang chờ:</b> {stats.scheduled}</li>
            <li><b>Đã hủy:</b> {stats.cancelled}</li>
          </ul>
        </div>
        <div className="sidebar-block">
          <h3 className="sidebar-title">Lịch hẹn sắp tới</h3>
          <ul className="upcoming-list">
            {upcoming.map((a, i) => (
              <li key={a.appointmentId} className="upcoming-item">
                <span className="upcoming-service">{a.serviceName}</span>
                <span className="upcoming-date">{a.date} {a.time}</span>
                <span className={`upcoming-status ${getStatusClass(a.statusAppointment)}`}>{getStatusText(a.statusAppointment)}</span>
              </li>
            ))}
            {upcoming.length === 0 && <li>Không có lịch hẹn sắp tới</li>}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default AppointmentList;
