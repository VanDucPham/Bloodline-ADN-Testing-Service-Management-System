import React, { useEffect, useState } from 'react';
import apiService from '../../service/api';
import './StaffAppointments.css';

const STATUS_OPTIONS = [
  'SCHEDULED',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
];

function StaffAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedParticipants, setSelectedParticipants] = useState(null);
  const [participantLoading, setParticipantLoading] = useState(false);
  const [participantError, setParticipantError] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);
  const [sampleLoading, setSampleLoading] = useState(false);
  const [sampleError, setSampleError] = useState(null);
  const [editingSample, setEditingSample] = useState(null);
  const [sampleUpdateValue, setSampleUpdateValue] = useState("");

  // Thêm các state cho form cập nhật sample
  const [sampleQuality, setSampleQuality] = useState("");
  const [sampleResult, setSampleResult] = useState("");
  const [sampleNotes, setSampleNotes] = useState("");

  // State cho form thêm participant mới
  const [newParticipants, setNewParticipants] = useState([
    { name: '', relationship: '', gender: '', citizenId: '', address: '', birthDate: '' }
  ]);
  const [addParticipantError, setAddParticipantError] = useState('');
  const [addParticipantSuccess, setAddParticipantSuccess] = useState('');

  // State cho việc tạo sample mới
  const [showCreateSample, setShowCreateSample] = useState(false);
  const [createSampleData, setCreateSampleData] = useState({
    sampleType: '',
    collectionDateTime: '',
    quality: '',
    notes: '',
  });
  const [createSampleError, setCreateSampleError] = useState('');
  const [createSampleSuccess, setCreateSampleSuccess] = useState('');

  // Thêm state cho bộ lọc trạng thái và tìm kiếm theo ID
  const [statusFilter, setStatusFilter] = useState('');
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]); // Gọi lại khi statusFilter thay đổi

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Nếu có statusFilter thì truyền vào, không thì lấy tất cả
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await apiService.staff.getAppointment(params);
      setAppointments(response);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách lịch hẹn:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    setUpdatingId(appointmentId);
    try {
      await apiService.staff.updateAppointmentStatus(appointmentId, newStatus);
      // Sau khi cập nhật, loại bỏ lịch hẹn khỏi danh sách (ẩn đi)
      setAppointments((prev) => prev.filter(item => item.appointmentId !== appointmentId));
    } catch (error) {
      alert('Cập nhật trạng thái thất bại!');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleShowParticipants = async (appointmentId) => {
    setParticipantLoading(true);
    setParticipantError(null);
    setSelectedParticipants(null);
    setSelectedSample(null); // reset sample khi chọn lịch hẹn khác
    setEditingSample(null);  // reset form sửa sample
    setShowCreateSample(false); // reset form tạo sample
    setAddParticipantError('');
    setAddParticipantSuccess(''); // reset thông báo khi chuyển lịch hẹn
    setCreateSampleError('');
    setCreateSampleSuccess('');
    try {
      const data = await apiService.staff.getParticipantsByAppointmentId(appointmentId);
      setSelectedParticipants({ appointmentId, data });
    } catch (error) {
      setParticipantError('Không thể tải thông tin participant!');
    } finally {
      setParticipantLoading(false);
    }
  };

  const handleShowSample = async (participantId) => {
    setSampleLoading(true);
    setSampleError(null);
    setSelectedSample(null);
    try {
      const data = await apiService.staff.getSampleByParticipantId(participantId);
      // Nếu không có sample, backend có thể trả về null hoặc 404
      if (!data || Object.keys(data).length === 0) {
        setSelectedSample({ participantId, data: {} }); // Chưa có sample
      } else {
        setSelectedSample({ participantId, data });
        setSampleUpdateValue(data?.sampleValue || "");
      }
    } catch (error) {
      // Nếu lỗi là 404 hoặc không có sample thì không báo lỗi, chỉ coi là chưa có sample
      if (error?.response?.status === 404) {
        setSelectedSample({ participantId, data: {} });
      } else {
        setSampleError("Không thể tải thông tin sample!" + (error?.message ? (" (" + error.message + ")") : ""));
      }
    } finally {
      setSampleLoading(false);
    }
  };

  const handleEditSample = (sample) => {
    setEditingSample(sample);
    setSampleQuality(sample.quality || "");
    setSampleResult(sample.result || "");
    setSampleNotes(sample.notes || "");
  };

  const handleUpdateSample = async () => {
    if (!editingSample) return;
    setSampleLoading(true);
    setSampleError(null);
    try {
      await apiService.staff.updateSample({
        sampleId: editingSample.sampleId,
        quality: sampleQuality,
        result: sampleResult,
        notes: sampleNotes,
      });
      setSelectedSample((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          quality: sampleQuality,
          result: sampleResult,
          notes: sampleNotes,
        },
      }));
      setEditingSample(null);
    } catch (error) {
      setSampleError("Cập nhật sample thất bại!");
    } finally {
      setSampleLoading(false);
    }
  };

  const handleNewParticipantChange = (idx, e) => {
    const updated = [...newParticipants];
    updated[idx][e.target.name] = e.target.value;
    setNewParticipants(updated);
  };
  const addNewParticipantRow = () => {
    setNewParticipants([...newParticipants, { name: '', relationship: '', gender: '', citizenId: '', address: '', birthDate: '' }]);
  };
  const removeNewParticipantRow = idx => {
    if (newParticipants.length === 1) return;
    setNewParticipants(newParticipants.filter((_, i) => i !== idx));
  };

  const handleAddParticipants = async (e) => {
    e.preventDefault();
    setAddParticipantError('');
    setAddParticipantSuccess('');
    if (!selectedParticipants?.appointmentId) {
      setAddParticipantError('Không xác định được lịch hẹn!');
      return;
    }
    for (const p of newParticipants) {
      if (!p.name || !p.relationship || !p.gender || !p.citizenId || !p.address || !p.birthDate) {
        setAddParticipantError('Vui lòng nhập đầy đủ thông tin cho tất cả người tham gia!');
        return;
      }
    }
    const payload = newParticipants.map(p => ({ ...p, appointmentId: selectedParticipants.appointmentId }));
    try {
      await apiService.staff.addParticipants(payload);
      setAddParticipantSuccess('Thêm người tham gia thành công!');
      setNewParticipants([{ name: '', relationship: '', gender: '', citizenId: '', address: '', birthDate: '' }]);
      // Reload lại participant
      handleShowParticipants(selectedParticipants.appointmentId);
      // Ẩn thông báo sau 2s
      setTimeout(() => setAddParticipantSuccess(''), 2000);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message;
      setAddParticipantError(msg || 'Thêm người tham gia thất bại!');
    }
  };

  const handleShowCreateSample = () => {
    setShowCreateSample(true);
  };

  const handleCancelCreateSample = () => {
    setShowCreateSample(false);
    setCreateSampleData({
      sampleType: '',
      collectionDateTime: '',
      quality: '',
      status: '', // reset trường status
      notes: '',
    });
    setCreateSampleError('');
    setCreateSampleSuccess('');
  };

  const handleCreateSampleChange = (e) => {
    const { name, value } = e.target;
    setCreateSampleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateSample = async (participantId) => {
    setCreateSampleError('');
    setCreateSampleSuccess('');
    try {
      await apiService.staff.createSample({
        participantId,
        ...createSampleData,
      });
      setCreateSampleSuccess('Tạo sample thành công!');
      setShowCreateSample(false);
      // Reload lại sample
      handleShowSample(participantId);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message;
      setCreateSampleError(msg || 'Tạo sample thất bại!');
    }
  };

  // Lọc dữ liệu theo trạng thái và mã lịch hẹn
  const filteredAppointments = appointments.filter(item => {
    const matchStatus = statusFilter ? item.appointmentStatus === statusFilter : true;
    const matchId = searchId ? String(item.appointmentId) === searchId : true;
    return matchStatus && matchId;
  });

  return (
    <div className="staff-appointments-container">
      <h2>📅 Danh sách lịch hẹn</h2>
      {/* Bộ lọc trạng thái và tìm kiếm theo mã lịch hẹn */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
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
          <label>Tìm theo mã lịch hẹn: </label>
          <input
            type="text"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            placeholder="Nhập mã lịch hẹn"
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
                <th>Mã lịch hẹn</th>
                <th>Người dùng</th>
                <th>Ngày</th>
                <th>Giờ</th>
                <th>Trạng thái</th>
                <th>Dịch vụ</th>
                <th>Phương thức lấy mẫu</th>
                <th>Loại lịch hẹn</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((item, idx) => (
                <tr key={idx} className="staff-appointment-row" style={{ cursor: 'pointer' }} onClick={() => handleShowParticipants(item.appointmentId)}>
                  <td>{item.appointmentId}</td>
                  <td>{item.userId}</td>
                  <td>{item.appointmentDate}</td>
                  <td>{item.appointmentTime}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <select
                      value={item.appointmentStatus}
                      disabled={updatingId === item.appointmentId}
                      onChange={e => handleStatusChange(item.appointmentId, e.target.value)}
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>{item.serviceId}</td>
                  <td>{item.deliveryMethod}</td>
                  <td>{item.appointmentType}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {participantLoading && <p>Đang tải participant...</p>}
          {participantError && <p style={{color:'red'}}>{participantError}</p>}
          {selectedParticipants && (
            <div className="staff-participant-info">
              <h3>👥 Participant của lịch hẹn {selectedParticipants.appointmentId}</h3>
              {Array.isArray(selectedParticipants.data) && selectedParticipants.data.length > 0 ? (
                <ul>
                  {selectedParticipants.data.map((p, i) => (
                    <li key={i} style={{cursor:'pointer'}} onClick={() => handleShowSample(p.participantId)}>
                      <strong>ID:</strong> {p.participantId} |
                      <strong>Tên:</strong> {p.name} |
                      <strong>Quan hệ:</strong> {p.relationship} |
                      <strong>Địa chỉ:</strong> {p.address} |
                      <strong>Ngày sinh:</strong> {p.birthDate} |
                      <strong>Giới tính:</strong> {p.gender} |
                      <strong>CCCD:</strong> {p.citizenId}
                    </li>
                  ))}
                </ul>
              ) : (
                <div>
                  <p>Không có participant nào! Hãy thêm participant</p>
                  <form onSubmit={handleAddParticipants} className="participant-form">
                    {newParticipants.map((p, idx) => (
                      <div key={idx} className="participant-row">
                        <input name="name" placeholder="Họ tên" value={p.name} onChange={e => handleNewParticipantChange(idx, e)} required />
                        <input name="relationship" placeholder="Quan hệ" value={p.relationship} onChange={e => handleNewParticipantChange(idx, e)} required />
                        <select name="gender" value={p.gender} onChange={e => handleNewParticipantChange(idx, e)} required>
                          <option value="">Giới tính</option>
                          <option value="MALE">Nam</option>
                          <option value="FEMALE">Nữ</option>
                          <option value="OTHER">Khác</option>
                        </select>
                        <input name="citizenId" placeholder="CMND/CCCD" value={p.citizenId} onChange={e => handleNewParticipantChange(idx, e)} required />
                        <input name="address" placeholder="Địa chỉ" value={p.address} onChange={e => handleNewParticipantChange(idx, e)} required />
                        <input name="birthDate" type="date" placeholder="Ngày sinh" value={p.birthDate} onChange={e => handleNewParticipantChange(idx, e)} required />
                        <button type="button" onClick={() => removeNewParticipantRow(idx)} disabled={newParticipants.length === 1}>-</button>
                        {idx === newParticipants.length - 1 && (
                          <button type="button" onClick={addNewParticipantRow}>+</button>
                        )}
                      </div>
                    ))}
                    <button type="submit">Lưu người tham gia</button>
                    {addParticipantError && <p className="error-msg">{addParticipantError}</p>}
                    {addParticipantSuccess && <p className="success-msg">{addParticipantSuccess}</p>}
                  </form>
                </div>
              )}
              {sampleLoading && <p>Đang tải sample...</p>}
              {sampleError && <p style={{color:'red'}}>{sampleError}</p>}
              {selectedSample && (
                <div className="staff-sample-info">
                  <h4>🧪 Sample của participant {selectedSample.participantId}</h4>
                  {(!selectedSample.data || !selectedSample.data.sampleId) ? (
                    <div>
                      <p>Chưa có sample cho participant này.</p>
                      {!showCreateSample ? (
                        <button onClick={handleShowCreateSample}>Tạo sample</button>
                      ) : (
                        <form onSubmit={e => { e.preventDefault(); handleCreateSample(selectedSample.participantId); }} className="sample-create-form">
                          <div>
                            <label>Loại mẫu:</label>
                            <select name="sampleType" value={createSampleData.sampleType} onChange={handleCreateSampleChange} required>
                              <option value="">--Chọn--</option>
                              <option value="BLOOD">Máu (BLOOD)</option>
                              <option value="SALIVA">Nước bọt (SALIVA)</option>
                              <option value="HAIR">Tóc (HAIR)</option>
                              <option value="OTHER">Khác (OTHER)</option>
                            </select>
                          </div>
                          <div>
                            <label>Thời gian lấy mẫu:</label>
                            <input name="collectionDateTime" type="datetime-local" value={createSampleData.collectionDateTime} onChange={handleCreateSampleChange} required />
                          </div>
                          <div>
                            <label>Chất lượng:</label>
                            <select name="quality" value={createSampleData.quality} onChange={handleCreateSampleChange} required>
                              <option value="">--Chọn--</option>
                              <option value="EXCELLENT">EXCELLENT</option>
                              <option value="GOOD">GOOD</option>
                              <option value="FAIR">FAIR</option>
                              <option value="POOR">POOR</option>
                            </select>
                          </div>
                          <div>
                            <label>Ghi chú:</label>
                            <textarea name="notes" value={createSampleData.notes} onChange={handleCreateSampleChange} />
                          </div>
                          <button type="submit">Lưu sample</button>
                          <button type="button" onClick={handleCancelCreateSample}>Hủy</button>
                          {createSampleError && <p className="error-msg">{createSampleError}</p>}
                          {createSampleSuccess && <p className="success-msg">{createSampleSuccess}</p>}
                        </form>
                      )}
                    </div>
                  ) : (
                    <>
                      <p>
                        <strong>ID:</strong> {selectedSample.data.sampleId} |
                        <strong>Participant Id:</strong> {selectedSample.data.participantId} |
                        <strong>Loại:</strong> {selectedSample.data.sampleType} |
                        <strong>Thời gian:</strong> {selectedSample.data.collectionDateTime} |
                        <strong>Chất lượng:</strong> {selectedSample.data.quality} |
                        <strong>Trạng thái:</strong> {selectedSample.data.status} |
                        <strong>Kết quả:</strong> {selectedSample.data.result} |
                        <strong>Ghi chú:</strong> {selectedSample.data.notes}
                      </p>
                      {editingSample && editingSample.sampleId === selectedSample.data.sampleId ? (
                        <div className="sample-edit-form">
                          <div>
                            <label>Chất lượng:</label>
                            <select value={sampleQuality} onChange={e => setSampleQuality(e.target.value)}>
                              <option value="">--Chọn--</option>
                              <option value="POOR">POOR</option>
                              <option value="FAIR">FAIR</option>
                              <option value="GOOD">GOOD</option>
                              <option value="EXCELLENT">EXCELLENT</option>
                            </select>
                          </div>
                          <div>
                            <label>Trạng thái:</label>
                            <select value={selectedSample.data.status || ''} onChange={e => setSelectedSample(prev => ({ ...prev, data: { ...prev.data, status: e.target.value } }))}>
                              <option value="">--Chọn--</option>
                              <option value="COLLECTED">COLLECTED</option>
                              <option value="PROCESSING">PROCESSING</option>
                              <option value="ANALYZED">ANALYZED</option>
                              <option value="COMPLETED">COMPLETED</option>
                            </select>
                          </div>
                          <div>
                            <label>Kết quả:</label>
                            <input value={sampleResult} onChange={e => setSampleResult(e.target.value)} />
                          </div>
                          <div>
                            <label>Ghi chú:</label>
                            <input value={sampleNotes} onChange={e => setSampleNotes(e.target.value)} />
                          </div>
                          <button onClick={handleUpdateSample}>Lưu</button>
                          <button onClick={() => setEditingSample(null)}>Hủy</button>
                        </div>
                      ) : (
                        <button onClick={() => handleEditSample(selectedSample.data)}>Sửa sample</button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>Không có lịch hẹn nào!</p>
      )}
    </div>
  );
}

export default StaffAppointments;
