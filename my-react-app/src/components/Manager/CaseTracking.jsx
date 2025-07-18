import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Input, Select, Modal, Steps, Spin, Alert } from "antd";
import apiService from '../../service/api';


const statusOptions = [
  { value: "SCHEDULED", label: "Chờ tiếp nhận", color: "default" },
  { value: "CONFIRMED", label: "Đã tiếp nhận", color: "orange" },
  { value: "IN_PROGRESS", label: "Đang xử lý", color: "blue" },
  { value: "COMPLETED", label: "Hoàn thành", color: "green" },
  { value: "CANCELLED", label: "Từ chối / Hủy", color: "red" },
]

export default function CaseTracking() {
  const [caseData, setCaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiService.manager.getAllTracking();
        console.log("👉 Dữ liệu từ API:", res);
        setCaseData(res);
      } catch (err) {
        console.error("Failed to fetch case data:", err);
        setError("Không thể tải dữ liệu hồ sơ.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = Array.isArray(caseData)
    ? caseData.filter(
      c =>
        (c.caseId?.toLowerCase().includes(search.toLowerCase()) ||
          c.customer?.toLowerCase().includes(search.toLowerCase())) &&
        (!statusFilter || c.status === statusFilter)
    )

    : [];


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
        <Button type="link" onClick={() => setSelected(record)}>Xem chi tiết</Button>
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

      <Modal
        open={!!selected}
        title={`Chi tiết hồ sơ ${selected?.caseId}`}
        onCancel={() => setSelected(null)}
        footer={null}
        width={600}
      >
        {selected && (
          <>
            <div><b>Khách hàng:</b> {selected.customer}</div>
            <div><b>Loại hồ sơ:</b> {selected.type}</div>
            <div><b>Nhân viên phụ trách:</b> {selected.staff}</div>
            <div><b>Trạng thái hiện tại:</b>{" "}
              <Tag color={statusOptions.find(s => s.value === selected.status)?.color}>
                {statusOptions.find(s => s.value === selected.status)?.label || selected.status}
              </Tag>
            </div>
            <div style={{ margin: "18px 0 8px 0" }}><b>Tiến trình xử lý:</b></div>
            <Steps
              direction="vertical"
              size="small"
              current={selected.timeline.length - 1}
              items={selected.timeline.map(t => ({
                title: t.title,
                description: t.date
              }))}
            />
          </>
        )}
      </Modal>
    </div>
  );
}