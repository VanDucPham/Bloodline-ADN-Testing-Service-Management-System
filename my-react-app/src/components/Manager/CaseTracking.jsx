// src/pages/CaseTracking.jsx
import React, { useState } from "react";
import { Table, Tag, Button, Input, Select, Modal, Steps } from "antd";

const statusOptions = [
  { value: "pending", label: "Chờ tiếp nhận", color: "default" },
  { value: "processing", label: "Đang xử lý", color: "blue" },
  { value: "testing", label: "Đang xét nghiệm", color: "orange" },
  { value: "waiting", label: "Chờ kết quả", color: "purple" },
  { value: "completed", label: "Hoàn thành", color: "green" },
  { value: "delivered", label: "Đã trả kết quả", color: "success" },
  { value: "cancelled", label: "Từ chối / Hủy", color: "red" },
];

const caseData = [
  {
    caseId: "HS001",
    customer: "Trần Văn Bình",
    type: "Hành chính",
    createdAt: "2025-07-01",
    status: "testing",
    staff: "Nguyễn Văn A",
    timeline: [
      { title: "Tiếp nhận", date: "2025-07-01" },
      { title: "Lấy mẫu", date: "2025-07-02" },
      { title: "Xét nghiệm", date: "2025-07-03" },
    ]
  },
  {
    caseId: "HS002",
    customer: "Lê Thị Mai",
    type: "Dân sự",
    createdAt: "2025-07-02",
    status: "waiting",
    staff: "Trần Thị B",
    timeline: [
      { title: "Tiếp nhận", date: "2025-07-02" },
      { title: "Lấy mẫu", date: "2025-07-03" },
      { title: "Xét nghiệm", date: "2025-07-04" },
      { title: "Chờ kết quả", date: "2025-07-05" },
    ]
  },
  {
    caseId: "HS003",
    customer: "Phạm Văn Cường",
    type: "Hành chính",
    createdAt: "2025-07-03",
    status: "completed",
    staff: "Lê Văn C",
    timeline: [
      { title: "Tiếp nhận", date: "2025-07-03" },
      { title: "Lấy mẫu", date: "2025-07-04" },
      { title: "Xét nghiệm", date: "2025-07-05" },
      { title: "Chờ kết quả", date: "2025-07-06" },
      { title: "Hoàn thành", date: "2025-07-07" },
    ]
  },
  {
    caseId: "HS004",
    customer: "Nguyễn Thị Hạnh",
    type: "Dân sự",
    createdAt: "2025-07-04",
    status: "delivered",
    staff: "Phạm Thị D",
    timeline: [
      { title: "Tiếp nhận", date: "2025-07-04" },
      { title: "Lấy mẫu", date: "2025-07-05" },
      { title: "Xét nghiệm", date: "2025-07-06" },
      { title: "Chờ kết quả", date: "2025-07-07" },
      { title: "Hoàn thành", date: "2025-07-08" },
      { title: "Đã trả kết quả", date: "2025-07-09" },
    ]
  },
  {
    caseId: "HS005",
    customer: "Lê Văn Thanh",
    type: "Hành chính",
    createdAt: "2025-07-05",
    status: "cancelled",
    staff: "Hoàng Văn E",
    timeline: [
      { title: "Tiếp nhận", date: "2025-07-05" },
      { title: "Lấy mẫu", date: "2025-07-06" },
      { title: "Từ chối / Hủy", date: "2025-07-07" },
    ]
  },
];

export default function CaseTracking() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = caseData.filter(
    c =>
      (c.caseId.toLowerCase().includes(search.toLowerCase()) ||
        c.customer.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || c.status === statusFilter)
  );

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
        return <Tag color={st?.color}>{st?.label}</Tag>;
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
            <div><b>Trạng thái hiện tại:</b> <Tag color={statusOptions.find(s => s.value === selected.status)?.color}>{statusOptions.find(s => s.value === selected.status)?.label}</Tag></div>
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
