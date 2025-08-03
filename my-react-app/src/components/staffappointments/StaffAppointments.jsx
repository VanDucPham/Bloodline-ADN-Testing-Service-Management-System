import React, { useEffect, useState } from 'react';
import apiService from '../../service/api';
import './StaffAppointments.css';
import moment from 'moment';
import ParticipantModal from './ParticipantModal';
import ResultModal from './ResultModal';


const STATUS_OPTIONS = [
  'SCHEDULED',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
];

const COLLECTION_STATUS_OPTIONS = [
  'ASSIGNED',
  'TRAVELING',
  'ARRIVED',
  'COLLECTING',
  'COMPLETED',
];

function StaffAppointments() {
  // Hàm chuyển đổi lịch hẹn sang tiếng Việt
  const getAppointmentStatusText = (status) => {
    const statusMap = {
      'SCHEDULED': 'Đã lên lịch',
      'CONFIRMED': 'Đã xác nhận',
      'IN_PROGRESS': 'Đang thực hiện',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getAllowedStatusOptions = (currentStatus) => {
    const currentIndex = STATUS_OPTIONS.indexOf(currentStatus);
    if (currentIndex === -1) return [];
    return STATUS_OPTIONS.slice(currentIndex); // chỉ lấy từ trạng thái hiện tại trở đi
  };

  // Hàm chuyển đổi trạng thái thu mẫu sang tiếng Việt
  const getCollectionStatusText = (status) => {
    const statusMap = {
      'ASSIGNED': 'Đã phân công',
      'TRAVELING': 'Đang di chuyển',
      'ARRIVED': 'Đã đến',
      'COLLECTING': 'Đã thu lại kit',
      'COMPLETED': 'Hoàn thành'
    };
    return statusMap[status] || status;
  };

  const getAllowedCollectionStatus = (currentStatus) => {
  const currentIndex = COLLECTION_STATUS_OPTIONS.indexOf(currentStatus);
  if (currentIndex === -1) return [];
  return COLLECTION_STATUS_OPTIONS.slice(currentIndex); // chỉ lấy từ trạng thái hiện tại trở đi
};

  // Hàm chuyển đổi phương thức lấy mẫu sang tiếng Việt
  const getDeliveryMethodText = (method) => {
    const methodMap = {
      'SELF_DROP_OFF': 'Đến cơ sở',
      'HOME_COLLECTION': 'Thu mẫu tại nhà',
      'HOME_DELIVERY': 'Nhân viên đến nhà lấy mẫu'
    };
    return methodMap[method] || method;
  };

  // Hàm chuyển đổi loại lịch hẹn sang tiếng Việt
  const getAppointmentTypeText = (type) => {
    const typeMap = {
      'ADMINISTRATIVE': 'Hành chính',
      'CIVIL': 'Dân sự'
    };
    return typeMap[type] || type;
  };

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Participant & Sample states
  const [selectedParticipants, setSelectedParticipants] = useState(null);
  const [participantLoading, setParticipantLoading] = useState(false);
  const [participantError, setParticipantError] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);
  const [sampleLoading, setSampleLoading] = useState(false);
  const [sampleError, setSampleError] = useState(null);

  // Modal participant 
  const [participantModalOpen, setParticipantModalOpen] = useState(false);
  // Modal quản lý nhập/hiển thị kết quả
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [selectedAppointmentForResult, setSelectedAppointmentForResult] = useState(null);
  const [existingResult, setExistingResult] = useState(null);

  // Form states for sample editing
  const [editingSample, setEditingSample] = useState(null);

  // Form states for adding participants
  const [showAddParticipantForm, setShowAddParticipantForm] = useState(false);
  const [addParticipantLoading, setAddParticipantLoading] = useState(false);
  const [addParticipantError, setAddParticipantError] = useState('');
  const [addParticipantSuccess, setAddParticipantSuccess] = useState('');

  // Form states for creating sample
  const [showCreateSample, setShowCreateSample] = useState(false);
  const [createSampleLoading, setCreateSampleLoading] = useState(false);
  const [createSampleError, setCreateSampleError] = useState('');
  const [createSampleSuccess, setCreateSampleSuccess] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  // const [dateFilter, setDateFilter] = useState(moment()); // Mặc định ngày hôm nay
  const [dateFilter, setDateFilter] = useState(() => moment());

  const [searchId, setSearchId] = useState('');
  const [searchCaseCode, setSearchCaseCode] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (dateFilter) params.appointmentDate = dateFilter.format('YYYY-MM-DD');
      const response = await apiService.staff.getAppointment(params);
      setAppointments(response);
      console.log(response);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách lịch hẹn:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusOrCollectionChange = async (appointmentId, field, newValue) => {
    setUpdatingId(appointmentId);
    try {
      const appointment = appointments.find(item => item.appointmentId === appointmentId);
      if (!appointment) throw new Error('Không tìm thấy lịch hẹn');
      const appointmentStatus = field === 'appointmentStatus' ? newValue : appointment.appointmentStatus;
      const collectionStatus = field === 'collectionStatus' ? newValue : appointment.collectionStatus;

      await apiService.staff.updateAppointmentStatusAndCollectionStatus(
        appointmentId,
        appointmentStatus,
        collectionStatus
      );
      // Cập nhật lại danh sách hoặc cập nhật state
      await fetchAppointments();
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái chi tiết:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert('Lỗi khi cập nhật trạng thái: ' + error.response.data.message);
      } else if (error.message) {
        alert('Lỗi khi cập nhật trạng thái: ' + error.message);
      } else {
        alert('Cập nhật trạng thái thất bại!');
      }
    }

    finally {
      setUpdatingId(null);
    }
  };

  const handleShowParticipants = async (appointmentId) => {
    setParticipantLoading(true);
    setParticipantError(null);
    setSelectedParticipants(null);
    setSelectedSample(null);
    setSampleError(null);
    setEditingSample(null);
    setShowCreateSample(false);
    setAddParticipantError('');
    setAddParticipantSuccess('');
    setCreateSampleError('');
    setCreateSampleSuccess('');
    try {
      const data = await apiService.staff.getParticipantsByAppointmentId(appointmentId);
      const appointment = appointments.find(a => a.appointmentId === appointmentId);
      const limitPeople = appointment?.limitPeople || 1; // Lấy giới hạn người
      
      // Lấy thông tin service với participantType
      let service = null;
      if (appointment?.serviceId) {
        try {
          service = await apiService.staff.getServiceById(appointment.serviceId);
        } catch (error) {
          console.warn('Không thể lấy thông tin service:', error);
        }
      }
      
      setSelectedParticipants({ appointmentId, data, limitPeople, service });
      setParticipantModalOpen(true);
    } catch (error) {
      setParticipantError('Không thể tải thông tin participant!');
    } finally {
      setParticipantLoading(false);
    }
  };

  const handleCloseParticipantModal = () => {
    setParticipantModalOpen(false);
    setSelectedParticipants(null);
    setSelectedSample(null);
    setParticipantError(null);
    setSampleError(null);
    setEditingSample(null);
    setShowCreateSample(false);
    setAddParticipantError('');
    setAddParticipantSuccess('');
    setCreateSampleError('');
    setCreateSampleSuccess('');
  };

  const handleShowSample = async (participantId) => {
    setSampleLoading(true);
    setSampleError(null);
    setSelectedSample(null);
    setEditingSample(null);
    setShowCreateSample(false);
    try {
      const data = await apiService.staff.getSampleByParticipantId(participantId);
      if (!data || Object.keys(data).length === 0) {
        setSelectedSample({ participantId, data: {} });
      } else {
        setSelectedSample({ participantId, data });
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        setSelectedSample({ participantId, data: {} });
      } else {
        setSampleError("Không thể tải thông tin sample!" + (error?.message ? (" (" + error.message + ")") : ""));
      }
    } finally {
      setSampleLoading(false);
    }
  };

  // Mở popup kết quả, lấy kết quả nếu có
  const handleOpenResultModal = async (appointment) => {
    try {
      const result = await apiService.staff.getResultByAppointmentId(appointment.appointmentId);

      setExistingResult(result); // null nếu chưa có kết quả
      setSelectedAppointmentForResult(appointment);
      setResultModalOpen(true);
    } catch (error) {
      alert('Lỗi khi lấy kết quả');
    }
  };

  const handleCloseResultModal = () => {
    setSelectedAppointmentForResult(null);
    setExistingResult(null);
    setResultModalOpen(false);
  };


  const onAddParticipant = async (values) => {
    if (!selectedParticipants?.appointmentId) {
      setAddParticipantError('Không xác định được lịch hẹn!');
      return;
    }
    setAddParticipantLoading(true);
    setAddParticipantError('');
    setAddParticipantSuccess('');
    try {
      const payload = values.map(p => ({
        ...p,
        appointmentId: selectedParticipants.appointmentId,
        birthDate: p.birthDate ? moment(p.birthDate).format('YYYY-MM-DD') : null,
      })); await apiService.staff.addParticipants(payload);
      setAddParticipantSuccess('Thêm người tham gia thành công!');
      await handleShowParticipants(selectedParticipants.appointmentId);
      setShowAddParticipantForm(false);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message;
      setAddParticipantError(msg || 'Thêm người tham gia thất bại!');
    } finally {
      setAddParticipantLoading(false);
    }
  };

  const onCreateSample = async (values) => {
    if (!selectedSample?.participantId) return;
    setCreateSampleLoading(true);
    setCreateSampleError('');
    setCreateSampleSuccess('');
    try {
      const payload = {
        participantId: selectedSample.participantId,
        sampleType: values.sampleType,
        notes: values.notes,
      };
      await apiService.staff.createSample(payload);
      setCreateSampleSuccess('Tạo sample thành công!');
      await handleShowSample(selectedSample.participantId);
      setShowCreateSample(false);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message;
      setCreateSampleError(msg || 'Tạo sample thất bại!');
    } finally {
      setCreateSampleLoading(false);
    }
  };

  const onUpdateSample = async (values) => {
    if (!editingSample) return;
    try {
      await apiService.staff.updateSample({
        sampleId: editingSample.sampleId,
        status: values.status,
        quality: values.quality,
        result: values.result,
        notes: values.notes,
      });
      await handleShowSample(editingSample.participantId);
      setEditingSample(null);
    } catch {
      setSampleError('Cập nhật sample thất bại!');
    }
  };

  const toggleAddParticipantForm = () => {
    setShowAddParticipantForm(prev => !prev);
    setAddParticipantError('');
    setAddParticipantSuccess('');
  };

  // Hàm lưu result
  const handleSaveResult = async (resultData) => {
    try {
      const payload = {
        appointmentId: selectedAppointmentForResult.appointmentId, // phải có giá trị hợp lệ
        resultValue: resultData.resultValue,
        notes: resultData.notes,
      };
      await apiService.staff.createResult(payload);
      alert('Lưu kết quả thành công!');
      handleCloseResultModal();
      fetchAppointments(); // Tải lại danh sách lịch hẹn để cập nhật nếu cần
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const message = error.response.data.message || 'Lỗi nghiệp vụ';
        alert(message);  // Hiển thị lỗi chi tiết từ backend

      } else {
        alert('Lỗi khi lưu kết quả: ' + (error.message || 'Không rõ lỗi'));
        throw error;
      }
    }
  };


  const onShowCreateSampleForm = () => setShowCreateSample(true);
  const onCancelCreateSample = () => setShowCreateSample(false);
  const onEditSample = (sample) => setEditingSample(sample);
  const onCancelEditSample = () => setEditingSample(null);

  const handleExportResult = async (appointmentId) => {
    try {
      console.log(`Bắt đầu gọi API xuất file PDF cho appointmentId: ${appointmentId}`);
      const response = await apiService.staff.exportAppointmentResult(appointmentId);
      if (!response) {
        alert('Không nhận được file từ máy chủ!');
        return;
      }

      const disposition = response.headers && response.headers['content-disposition'];
      const filenameMatch = disposition && disposition.match(/filename="?(.+)"?/);
      const filename = filenameMatch ? filenameMatch[1] : `result_${appointmentId}.pdf`;

      if (!(response instanceof Blob)) {
        alert('Dữ liệu trả về không phải file hợp lệ!');
        return;
      }

      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Xuất kết quả thất bại!');
      console.error('Lỗi khi xuất file PDF:', err);
    }
  };

  // Lọc dữ liệu theo status, ngày, mã lịch hẹn và mã hồ sơ
  const filteredAppointments = appointments
    .filter(item => {
      // Chỉ hiển thị nếu paymentStatus = COMPLETED
      if (item.paymentStatus !== "COMPLETED") return false;
      const matchStatus = statusFilter ? item.appointmentStatus === statusFilter : true;
      // Khai báo itemDate đúng vị trí
      const itemDate = moment(item.appointmentDate, 'YYYY-MM-DD').startOf('day');
      const filterDate = dateFilter ? dateFilter.clone().startOf('day') : null;
      const matchDate = filterDate
        ? itemDate.format('YYYY-MM-DD') === filterDate.format('YYYY-MM-DD')
        : true;
      const matchId = searchId ? String(item.appointmentId) === searchId : true;
      const matchCaseCode = searchCaseCode ? (item.caseCode && item.caseCode.toLowerCase().includes(searchCaseCode.toLowerCase())) : true;
      return matchStatus && matchDate && matchId && matchCaseCode;
    })
    .sort((a, b) => {
      // So sánh ngày (bỏ giờ)
      const dateA = moment(a.appointmentDate, 'YYYY-MM-DD');
      const dateB = moment(b.appointmentDate, 'YYYY-MM-DD');
      if (dateB.diff(dateA) !== 0) {
        return dateB.diff(dateA); // Ngày mới nhất lên trước
      }
      // Nếu ngày giống nhau, sắp xếp theo appointmentId giảm dần (id lớn hơn lên trước)
      return b.appointmentId - a.appointmentId;
    });



  return (
    <div className="staff-appointments-container">
      <h2>📅 Danh sách phiếu xét nghiệm ADN</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'center' }}>
        <div>
          <label>Lọc trạng thái: </label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Tất cả</option>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Lọc theo ngày: </label>
          <input
            type="date"
            value={dateFilter ? dateFilter.format('YYYY-MM-DD') : ''}
            onChange={e => {
              const value = e.target.value;
              if (value) {
                setDateFilter(moment(value, 'YYYY-MM-DD'));
              } else {
                setDateFilter(null);
              }
            }}
          />
        </div>
        <div>
          <label>Tìm theo mã phiếu xét nghiệm: </label>
          <input
            type="text"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            placeholder="Nhập mã phiếu xét nghiệm"
            style={{ width: 120 }}
          />
        </div>
        <div>
          <label>Tìm theo mã hồ sơ: </label>
          <input
            type="text"
            value={searchCaseCode}
            onChange={e => setSearchCaseCode(e.target.value)}
            placeholder="Nhập mã hồ sơ"
            style={{ width: 120 }}
          />
        </div>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : filteredAppointments.length > 0 ? (
        <div className="staff-appointments-table-wrapper">
          <table className="staff-appointments-table">
            <thead>
              <tr>
                <th>Mã phiếu xét nghiệm</th>
                <th>Mã hồ sơ</th>
                <th>Người dùng</th>
                <th>Ngày</th>
                <th>Giờ</th>
                <th>Trạng thái</th>
                <th>Trạng thái kit</th>
                <th>Dịch vụ</th>
                <th>Phương thức lấy mẫu</th>
                <th>Loại dịch vụ</th>
                <th>Hành động</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((item, idx) => (
                <tr key={idx} className="staff-appointment-row">
                  <td>{item.appointmentId}</td>
                  <td>{item.caseCode}</td>
                  <td>{item.userId}</td>
                  <td>{item.appointmentDate}</td>
                  <td>{item.appointmentTime}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <select
                      value={item.appointmentStatus || ''}
                      disabled={updatingId === item.appointmentId}
                      onChange={e =>
                        handleStatusOrCollectionChange(item.appointmentId, 'appointmentStatus', e.target.value)
                      }
                      style={{ minWidth: '120px' }}
                    >
                      {getAllowedStatusOptions(item.appointmentStatus).map(status => (
                        <option key={status} value={status}>
                          {getAppointmentStatusText(status)}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td onClick={e => e.stopPropagation()}>
                    <select
                      value={item.collectionStatus || ''}
                      disabled={updatingId === item.appointmentId}
                      onChange={e => handleStatusOrCollectionChange(item.appointmentId, 'collectionStatus', e.target.value)}
                      style={{ minWidth: '120px' }}
                    >
                      
                      {getAllowedCollectionStatus(item.collectionStatus).map(status => (
                        <option key={status} value={status} disabled={status === 'ARRIVED'}>{getCollectionStatusText(status) }</option>
                      ))}
                    </select>
                  </td>
                  <td>{item.serviceName}</td>
                  <td>{getDeliveryMethodText(item.deliveryMethod)}</td>
                  <td>{getAppointmentTypeText(item.appointmentType)}</td>
                  <td>
                    <button
                      onClick={() => handleShowParticipants(item.appointmentId)}
                      disabled={item.appointmentStatus === 'SCHEDULED'}
                      title={item.appointmentStatus === 'SCHEDULED' ? 'Chỉ xem participant khi đã xác nhận' : ''}
                    >
                      Xem participant
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleOpenResultModal(item)}>Kết quả</button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          {participantLoading && <p>Đang tải participant...</p>}
          {participantError && <p style={{ color: 'red' }}>{participantError}</p>}
        </div>
      ) : (
        <p>Không có phiếu xét nghiệm nào nào!</p>
      )}

      <ParticipantModal
        open={participantModalOpen}
        onClose={handleCloseParticipantModal}
        participants={selectedParticipants?.data || []}
        onShowSample={handleShowSample}
        sampleLoading={sampleLoading}
        sampleError={sampleError}
        selectedSample={selectedSample}
        onAddParticipant={onAddParticipant}
        onCreateSample={onCreateSample}
        onUpdateSample={onUpdateSample}
        editingSample={editingSample}
        onEditSample={onEditSample}
        onCancelEditSample={onCancelEditSample}
        showCreateSample={showCreateSample}
        onShowCreateSampleForm={onShowCreateSampleForm}
        onCancelCreateSample={onCancelCreateSample}
        createSampleLoading={createSampleLoading}
        createSampleError={createSampleError}
        createSampleSuccess={createSampleSuccess}
        showAddParticipantForm={showAddParticipantForm}
        onShowAddParticipantForm={toggleAddParticipantForm}
        addParticipantLoading={addParticipantLoading}
        addParticipantError={addParticipantError}
        addParticipantSuccess={addParticipantSuccess}
        allowAddParticipant={
          (() => {
            const status = appointments.find(a => a.appointmentId === selectedParticipants?.appointmentId)?.appointmentStatus;
            return status === 'IN_PROGRESS';
          })()
        }
        allowShowSample={
          (() => {
            const appointment = appointments.find(a => a.appointmentId === selectedParticipants?.appointmentId);
            return (
              (appointment?.appointmentStatus === 'IN_PROGRESS' || appointment?.appointmentStatus === 'COMPLETED') &&
              appointment?.collectionStatus === 'COMPLETED'
            );
          })()
        }
        service={selectedParticipants?.service}
        participantCount={selectedParticipants?.limitPeople || 1}
      />
      <ResultModal
        open={resultModalOpen}
        onClose={handleCloseResultModal}
        appointment={selectedAppointmentForResult}
        existingResult={existingResult}
        onSaveResult={handleSaveResult}
        onExportResult={handleExportResult}
      />

    </div>
  );
}

export default StaffAppointments;
