import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Input, Select, Modal, Steps, Spin, Alert } from "antd";
import apiService from '../../service/api';


export default function CaseTracking() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [caseDetails, setCaseDetails] = useState(null);
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
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiService.manager.getAllTracking();
      console.log("👉 Dữ liệu từ API: ", response);
      setData(response || []); // Sử dụng trực tiếp response thay vì response.data
    } catch (error) {
      console.error("❌ Lỗi khi tải dữ liệu:", error);
      setError("Không thể tải dữ liệu: " + error.message);
    } finally {
      setLoading(false);
    }
  };
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
                console.error(`❌ Error fetching sample for participant ${participant.participantId}:`, error);
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
              console.error("❌ Error processing samples:", error);
              setParticipants(response || []);
            });
        })
        .catch(error => {
          console.error("❌ Error fetching participants:", error);
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
          console.log("✅ Result data:", response);
          setResultData(response);
        })
        .catch(error => {
          console.error("❌ Error fetching result:", error);
          setResultError(error.message || "Lỗi khi tải dữ liệu kết quả");
        })
        .finally(() => {
          setLoadingResult(false);
        });
    }
  }, [activeTab, selected?.appointmentId]);

  useEffect(() => {
    fetchData();
  }, []);
  const filtered = data.filter(item => {
    const matchesSearch = item.caseId?.toLowerCase().includes(search.toLowerCase()) ||
                         item.customer?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  
  const columns = [
    { title: "Mã hồ sơ", dataIndex: "caseId", key: "caseId" },
    { title: "Khách hàng", dataIndex: "customer", key: "customer" },
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
    <div style={{ background: "#fff", padding: 24, borderRadius: 8, maxWidth: 2000, margin: "32px auto" }}>
      <h2>Theo dõi trạng thái hồ sơ</h2>

      {loading ? (
        <Spin tip="Đang tải dữ liệu..." />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Input.Search
              placeholder="Tìm theo mã hồ sơ hoặc khách hàng"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 260 }}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Lọc theo trạng thái"
              allowClear
              style={{ width: 180 }}
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
          <div className="tabs" style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
            <div className={`tab${activeTab === 0 ? ' active' : ''}`} style={{ padding: '10px 16px', background: activeTab === 0 ? '#017baf' : '#e0e7ef', color: activeTab === 0 ? '#fff' : '#015d84', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }} onClick={() => setActiveTab(0)}>Chi tiết lịch hẹn</div>
            <div className={`tab${activeTab === 1 ? ' active' : ''}`} style={{ padding: '10px 16px', background: activeTab === 1 ? '#017baf' : '#e0e7ef', color: activeTab === 1 ? '#fff' : '#015d84', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }} onClick={() => setActiveTab(1)}>Người tham gia & Mẫu</div>
            <div className={`tab${activeTab === 2 ? ' active' : ''}`} style={{ padding: '10px 16px', background: activeTab === 2 ? '#017baf' : '#e0e7ef', color: activeTab === 2 ? '#fff' : '#015d84', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }} onClick={() => setActiveTab(2)}>Thanh toán</div>
            <div className={`tab${activeTab === 3 ? ' active' : ''}`} style={{ padding: '10px 16px', background: activeTab === 3 ? '#017baf' : '#e0e7ef', color: activeTab === 3 ? '#fff' : '#015d84', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }} onClick={() => setActiveTab(3)}>Chi tiết kết quả</div>
          </div>
          <div className={`tab-content${activeTab === 0 ? ' active' : ''}`} style={{ display: activeTab === 0 ? 'block' : 'none' }}>
            <div><b>Mã lịch hẹn:</b> {selected.appointmentId || caseDetails?.appointmentId || 'Chưa có thông tin'}</div>
            <div><b>Khách hàng:</b> {selected.customer}</div>
            <div><b>Dịch vụ:</b> {selected.serviceName || caseDetails?.serviceName || 'Chưa có thông tin'}</div>
            <div><b>Ngày hẹn:</b> {selected.appointmentDate ? new Date(selected.appointmentDate).toLocaleDateString() : selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : 'Chưa có thông tin'}</div>
            <div><b>Giờ hẹn:</b> {selected.appointmentTime ? selected.appointmentTime : 'Chưa có thông tin'}</div>
            <div><b>Loại lịch hẹn:</b> {selected.type}</div>
            <div><b>Nhân viên phụ trách:</b> {selected.staff}</div>
            <div><b>Trạng thái hiện tại:</b>{' '}
              <Tag color={statusOptions.find(s => s.value === selected.status)?.color}>
                {statusOptions.find(s => s.value === selected.status)?.label || selected.status}
              </Tag>
            </div>
            <div><b>Mã hồ sơ:</b> {caseDetails?.caseCode || selected.caseId}</div>
            <div><b>Ngày tạo:</b> {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : 'Chưa có thông tin'}</div>
            <div style={{ margin: "18px 0 8px 0" }}><b>Tiến trình xử lý:</b></div>
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
              <div style={{ color: 'red', marginTop: 8 }}>Không có dữ liệu tiến trình xử lý!</div>
            )}
          </div>
          <div className={`tab-content${activeTab === 1 ? ' active' : ''}`} style={{ display: activeTab === 1 ? 'block' : 'none' }}>
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
                <div style={{ marginBottom: 16 }}>
                  <strong>Mã lịch hẹn:</strong> {selected.appointmentId}
                </div>
                <table className="detail-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>Họ tên</th>
                      <th style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>Số căn cước công dân</th>
                      <th style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>Quan hệ</th>
                      <th style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>Loại mẫu</th>
                      <th style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>Trạng thái mẫu</th>
                      <th style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>Kết quả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((p, index) => (
                      <tr key={index}>
                        <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>{p.name}</td>
                        <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>{p.citizenId}</td>
                        <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>{p.relationship}</td>
                        <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>{p.sampleDTO?.sampleType || 'Chưa có'}</td>
                        <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>{p.sampleDTO?.status || 'Chưa thu thập'}</td>
                        <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>{p.sampleDTO?.result || 'chưa có kết quả'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className={`tab-content${activeTab === 2 ? ' active' : ''}`} style={{ display: activeTab === 2 ? 'block' : 'none' }}>
            {selected?.paymentDTO ? (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <strong>Mã lịch hẹn:</strong> {selected.appointmentId}
                </div>
                <table className="detail-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>Mã thanh toán</th>
                      <th style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>Số tiền</th>
                      <th style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>Phương thức</th>
                      <th style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>Trạng thái</th>
                      <th style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>Ngày thanh toán</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>{selected.paymentDTO.paymentID}</td>
                      <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>
                        {selected.paymentDTO.paymentAmount.toLocaleString('vi-VN')} ₫
                      </td>
                      <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>{selected.paymentDTO.paymentMethod}</td>
                      <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>{selected.paymentDTO.paymentStatus}</td>
                      <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>{selected.paymentDTO.paymentDate}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <Alert type="info" message="Chưa có dữ liệu thanh toán cho lịch hẹn này" />
            )}
          </div>
          <div className={`tab-content${activeTab === 3 ? ' active' : ''}`} style={{ display: activeTab === 3 ? 'block' : 'none' }}>
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
                <div style={{ marginBottom: 16 }}>
                  <strong>Mã lịch hẹn:</strong> {selected.appointmentId}
                </div>
                <table className="detail-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left', fontWeight: 'bold' }}>Kết quả</td>
                      <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>{resultData.resultValue || 'Không có dữ liệu'}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left', fontWeight: 'bold' }}>Ghi chú</td>
                      <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>{resultData.notes || '-'}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left', fontWeight: 'bold' }}>Ngày phân tích</td>
                      <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>{resultData.resultDate ? new Date(resultData.resultDate).toLocaleString() : '-'}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left', fontWeight: 'bold' }}>Trạng thái</td>
                      <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>{resultData.status || '-'}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left', fontWeight: 'bold' }}>Người tham gia</td>
                      <td style={{ border: '1px solid #e0e7ef', padding: '10px 12px', textAlign: 'left' }}>{resultData.participants || '-'}</td>
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