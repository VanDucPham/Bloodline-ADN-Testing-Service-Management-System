import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Input, Select, Modal, Steps, Spin, Alert } from "antd";
import apiService from '../../service/api';
import './CaseTracking.css';


export default function CaseTracking() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [participantsError, setParticipantsError] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [loadingResult, setLoadingResult] = useState(false);
  const [resultError, setResultError] = useState(null);
  const statusOptions = [
    { value: "PENDING", label: "Chờ xử lý", color: "orange" },
    { value: "IN_PROGRESS", label: "Đang xử lý", color: "blue" },
    { value: "COMPLETED", label: "Hoàn thành", color: "green" },
    { value: "CANCELLED", label: "Đã hủy", color: "red" },
  ];
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiService.manager.getAllTracking();
        // Sắp xếp theo thứ tự ngược lại - mới nhất ở đầu
        const sortedData = response.sort((a, b) => {
          // So sánh theo createdAt (ngày tạo)
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          if (dateB - dateA !== 0) {
            return dateB - dateA; // Ngày mới nhất lên đầu
          }
          // Nếu ngày giống nhau, sắp xếp theo id giảm dần (id lớn hơn lên trước)
          return b.id - a.id;
        });
        setData(sortedData);
      } catch (error) {
        console.error("Error fetching case tracking:", error);
        setError(error.message || "Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  // Gọi API participants khi tab được mở
  useEffect(() => {
    if (activeTab === 1 && selected?.appointmentId) {
      setLoadingParticipants(true);
      setParticipantsError(null);
      
      apiService.staff.getParticipantsByAppointmentId(selected.appointmentId)
        .then(response => {
          // Gọi API sample cho mỗi participant
          const participantsWithSamples = response || [];
          const samplePromises = participantsWithSamples.map(participant => 
            apiService.staff.getSampleByParticipantId(participant.participantId)
              .then(sampleResponse => {
                return {
                  ...participant,
                  sampleDTO: sampleResponse
                };
              })
              .catch(error => {
                console.error(`Error fetching sample for participant ${participant.participantId}:`, error);
                return {
                  ...participant,
                  sampleDTO: null
                };
              })
          );
          
          Promise.all(samplePromises)
            .then(participantsWithSamples => {
              setParticipants(participantsWithSamples);
            })
            .catch(error => {
              console.error("Error processing samples:", error);
              setParticipants(response || []);
            });
        })
        .catch(error => {
          console.error("Error fetching participants:", error);
          setParticipantsError(error.message || "Lỗi khi tải dữ liệu người tham gia");
        })
        .finally(() => {
          setLoadingParticipants(false);
        });
    }
  }, [activeTab, selected?.appointmentId]);

  // Gọi API result khi tab được mở
  useEffect(() => {
    if (activeTab === 3 && selected?.appointmentId) {
      setLoadingResult(true);
      setResultError(null);
      
      apiService.staff.getResultByAppointmentId(selected.appointmentId)
        .then(response => {
          setResultData(response);
        })
        .catch(error => {
          console.error("Error fetching result:", error);
          setResultError(error.message || "Lỗi khi tải dữ liệu kết quả");
        })
        .finally(() => {
          setLoadingResult(false);
        });
    }
  }, [activeTab, selected?.appointmentId]);

  const filtered = data.filter(item => {
    const matchesSearch = item.caseId?.toLowerCase().includes(search.toLowerCase()) ||
                         item.customer?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  
  const columns = [
    { title: "Mã hồ sơ", dataIndex: "caseId", key: "caseId" },
    { title: "Người tạo lịch hẹn", dataIndex: "customer", key: "customer" },
    { title: "Loại hồ sơ", dataIndex: "type", key: "type" },
    { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: status => {
        const st = statusOptions.find(s => s.value === status);
        return <Tag color={st?.color}>{st?.label || status}</Tag>;
      }
    },
    { title: "Nhân viên phụ trách", dataIndex: "staff", key: "staff" },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => { 
          setSelected(record); 
        }}>Xem chi tiết</Button>
      ),
    },
  ];

  return (
    <div className="case-tracking-container">
      <h2 className="case-tracking-title">Theo dõi trạng thái hồ sơ</h2>

      {loading ? (
        <Spin tip="Đang tải dữ liệu..." />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <>
          <div className="search-filter-container">
            <Input.Search
              placeholder="Tìm theo mã hồ sơ hoặc khách hàng"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Lọc theo trạng thái"
              allowClear
              className="status-filter"
              options={statusOptions.map(s => ({ value: s.value, label: s.label }))}
            />
          </div>
          <Table
            columns={columns}
            dataSource={filtered}
            rowKey="caseId"
            pagination={{ pageSize: 6 }}
          />
        </>
      )}

      {/* Tabs hiển thị chi tiết khi chọn hồ sơ */}
      {selected && (
        <Modal
          open={!!selected}
          title={`Chi tiết hồ sơ ${selected?.caseId}`}
          onCancel={() => { setSelected(null); setActiveTab(0); }}
          footer={null}
          width={800}
        >
          <div className="tabs">
            <div className={`tab${activeTab === 0 ? ' active' : ''}`} onClick={() => setActiveTab(0)}>Chi tiết lịch hẹn</div>
            <div className={`tab${activeTab === 1 ? ' active' : ''}`} onClick={() => setActiveTab(1)}>Người tham gia & Mẫu</div>
            <div className={`tab${activeTab === 2 ? ' active' : ''}`} onClick={() => setActiveTab(2)}>Thanh toán</div>
            <div className={`tab${activeTab === 3 ? ' active' : ''}`} onClick={() => setActiveTab(3)}>Chi tiết kết quả</div>
          </div>
          <div className={`tab-content${activeTab === 0 ? ' active' : ''}`}>
            <div><b>Mã lịch hẹn:</b> {selected.appointmentId || 'Chưa có thông tin'}</div>
            <div><b>Người tạo lịch hẹn:</b> {selected.customer}</div>
            <div><b>Dịch vụ:</b> {selected.serviceName || 'Chưa có thông tin'}</div>
            <div><b>Ngày hẹn:</b> {selected.appointmentDate ? new Date(selected.appointmentDate).toLocaleDateString() : selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : 'Chưa có thông tin'}</div>
            <div><b>Giờ hẹn:</b> {selected.appointmentTime ? selected.appointmentTime : 'Chưa có thông tin'}</div>
            <div><b>Loại lịch hẹn:</b> {selected.type}</div>
            <div><b>Nhân viên phụ trách:</b> {selected.staff}</div>
            <div><b>Trạng thái hiện tại:</b>{' '}
              <Tag color={statusOptions.find(s => s.value === selected.status)?.color}>
                {statusOptions.find(s => s.value === selected.status)?.label || selected.status}
              </Tag>
            </div>
            <div><b>Mã hồ sơ:</b> {selected.caseId}</div>
            <div><b>Ngày tạo:</b> {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : 'Chưa có thông tin'}</div>
            <div className="timeline-section"><b>Tiến trình xử lý:</b></div>
            <Steps
              direction="vertical"
              size="small"
              current={Array.isArray(selected.timeline) ? selected.timeline.length - 1 : 0}
              items={Array.isArray(selected.timeline) ? selected.timeline.map(t => ({
                title: t.title,
                description: t.date
              })) : []}
            />
            {(!selected.timeline || !Array.isArray(selected.timeline)) && (
              <div className="no-data-message">Không có dữ liệu tiến trình xử lý!</div>
            )}
          </div>
          <div className={`tab-content${activeTab === 1 ? ' active' : ''}`}>
            {loadingParticipants ? (
              <Spin tip="Đang tải dữ liệu người tham gia..." />
            ) : participantsError ? (
              <Alert type="error" message={participantsError} />
            ) : !selected?.appointmentId ? (
              <Alert type="warning" message="Không có mã lịch hẹn để tải dữ liệu người tham gia" />
            ) : participants.length === 0 ? (
              <Alert type="info" message="Không có dữ liệu người tham gia cho lịch hẹn này" />
            ) : (
              <div>
                <div className="appointment-detail-item">
                  <strong>Mã lịch hẹn:</strong> {selected.appointmentId}
                </div>
                <table className="detail-table">
                  <thead>
                    <tr>
                      <th>Họ tên</th>
                      <th>Số căn cước công dân</th>
                      <th>Quan hệ</th>
                      <th>Loại mẫu</th>
                      <th>Trạng thái mẫu</th>
                      <th>Kết quả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((p, index) => (
                      <tr key={index}>
                        <td>{p.name}</td>
                        <td>{p.citizenId}</td>
                        <td>{p.relationship}</td>
                        <td>{p.sampleDTO?.sampleType || 'Chưa có'}</td>
                        <td>{p.sampleDTO?.status || 'Chưa thu thập'}</td>
                        <td>{p.sampleDTO?.result || 'chưa có kết quả'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className={`tab-content${activeTab === 2 ? ' active' : ''}`}>
            {selected?.paymentDTO ? (
              <div>
                <div className="appointment-detail-item">
                  <strong>Mã lịch hẹn:</strong> {selected.appointmentId}
                </div>
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
                    <tr>
                      <td>{selected.paymentDTO.paymentId}</td>
                      <td>
                        {selected.paymentDTO.amount ? selected.paymentDTO.amount.toLocaleString('vi-VN') : '0'} ₫
                      </td>
                      <td>{selected.paymentDTO.paymentMethod}</td>
                      <td>{selected.paymentDTO.status}</td>
                      <td>{selected.paymentDTO.paymentDate}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <Alert type="info" message="Chưa có dữ liệu thanh toán cho lịch hẹn này" />
            )}
          </div>
          <div className={`tab-content${activeTab === 3 ? ' active' : ''}`}>
            {loadingResult ? (
              <Spin tip="Đang tải dữ liệu kết quả..." />
            ) : resultError ? (
              <Alert type="error" message={resultError} />
            ) : !selected?.appointmentId ? (
              <Alert type="warning" message="Không có mã lịch hẹn để tải dữ liệu kết quả" />
            ) : !resultData ? (
              <Alert type="info" message="Chưa có dữ liệu kết quả cho lịch hẹn này" />
            ) : (
              <div>
                <div className="appointment-detail-item">
                  <strong>Mã lịch hẹn:</strong> {selected.appointmentId}
                </div>
                <table className="detail-table">
                  <tbody>
                    <tr>
                      <td className="bold">Kết quả</td>
                      <td>{resultData.resultValue || 'Không có dữ liệu'}</td>
                    </tr>
                    <tr>
                      <td className="bold">Ghi chú</td>
                      <td>{resultData.notes || '-'}</td>
                    </tr>
                    <tr>
                      <td className="bold">Ngày phân tích</td>
                      <td>{resultData.resultDate ? new Date(resultData.resultDate).toLocaleString() : '-'}</td>
                    </tr>
                    <tr>
                      <td className="bold">Trạng thái</td>
                      <td>{resultData.status || '-'}</td>
                    </tr>
                    <tr>
                      <td className="bold">Người tham gia</td>
                      <td>{resultData.participants ? (Array.isArray(resultData.participants) ? resultData.participants.join(', ') : resultData.participants) : '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}