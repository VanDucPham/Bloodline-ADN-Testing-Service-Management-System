// src/pages/FacilityScheduleWithAssign.jsx
import React, { useState } from "react";
import { Calendar, Badge, Card, Modal, List, Select, Button, Tag } from "antd";
import dayjs from "dayjs";

// Danh sách nhân viên mẫu
const staffList = [
  "Nguyễn Văn A",
  "Trần Thị B",
  "Lê Văn C",
  "Phạm Thị D",
  "Hoàng Văn E",
];

// Dữ liệu giả lập nhiều ngày trong tháng
const workSchedules = [
  {
    date: "2025-07-07",
    shifts: [
      {
        time: "08:00 - 12:00",
        staff: "Nguyễn Văn A",
        cases: [
          { caseId: "HS001", caseName: "Hồ sơ cha con", customer: "Trần Văn Bình", assignedStaff: "Nguyễn Văn A" },
          { caseId: "HS002", caseName: "Hồ sơ mẹ con", customer: "Lê Thị Mai", assignedStaff: "" }
        ]
      },
      {
        time: "13:00 - 17:00",
        staff: "Trần Thị B",
        cases: [
          { caseId: "HS003", caseName: "Hồ sơ hành chính", customer: "Phạm Văn Cường", assignedStaff: "" }
        ]
      },
    ],
  },
  {
    date: "2025-07-08",
    shifts: [
      {
        time: "08:00 - 12:00",
        staff: "Lê Văn C",
        cases: [
          { caseId: "HS004", caseName: "Hồ sơ dân sự", customer: "Nguyễn Thị Hạnh", assignedStaff: "Lê Văn C" },
          { caseId: "HS005", caseName: "Hồ sơ nhận cha", customer: "Lê Văn Thanh", assignedStaff: "" }
        ]
      },
      {
        time: "13:00 - 17:00",
        staff: "Phạm Thị D",
        cases: [
          { caseId: "HS006", caseName: "Hồ sơ hành chính", customer: "Trần Văn Hòa", assignedStaff: "" }
        ]
      },
    ],
  },
  {
    date: "2025-07-10",
    shifts: [
      {
        time: "08:00 - 12:00",
        staff: "Hoàng Văn E",
        cases: [
          { caseId: "HS007", caseName: "Hồ sơ cha con", customer: "Nguyễn Văn Khoa", assignedStaff: "" }
        ]
      }
    ]
  },
  {
    date: "2025-07-12",
    shifts: [
      {
        time: "08:00 - 12:00",
        staff: "Trần Thị B",
        cases: [
          { caseId: "HS008", caseName: "Hồ sơ dân sự", customer: "Phan Thị Hồng", assignedStaff: "" }
        ]
      },
      {
        time: "13:00 - 17:00",
        staff: "Nguyễn Văn A",
        cases: [
          { caseId: "HS009", caseName: "Hồ sơ hành chính", customer: "Đỗ Văn Minh", assignedStaff: "" },
          { caseId: "HS010", caseName: "Hồ sơ nhận cha", customer: "Lê Thị Tâm", assignedStaff: "" }
        ]
      },
    ]
  },
  {
    date: "2025-07-15",
    shifts: [
      {
        time: "08:00 - 12:00",
        staff: "Lê Văn C",
        cases: [
          { caseId: "HS011", caseName: "Hồ sơ cha con", customer: "Phạm Văn Quý", assignedStaff: "" }
        ]
      }
    ]
  },
  {
    date: "2025-07-18",
    shifts: [
      {
        time: "08:00 - 12:00",
        staff: "Phạm Thị D",
        cases: [
          { caseId: "HS012", caseName: "Hồ sơ dân sự", customer: "Nguyễn Thị Loan", assignedStaff: "" }
        ]
      }
    ]
  },
  {
    date: "2025-07-22",
    shifts: [
      {
        time: "08:00 - 12:00",
        staff: "Hoàng Văn E",
        cases: [
          { caseId: "HS013", caseName: "Hồ sơ hành chính", customer: "Trần Văn Lực", assignedStaff: "" }
        ]
      },
      {
        time: "13:00 - 17:00",
        staff: "Nguyễn Văn A",
        cases: [
          { caseId: "HS014", caseName: "Hồ sơ nhận cha", customer: "Lê Văn Hùng", assignedStaff: "" }
        ]
      }
    ]
  },
  {
    date: "2025-07-25",
    shifts: [
      {
        time: "08:00 - 12:00",
        staff: "Trần Thị B",
        cases: [
          { caseId: "HS015", caseName: "Hồ sơ cha con", customer: "Nguyễn Văn Hòa", assignedStaff: "" }
        ]
      }
    ]
  }
  // ... có thể bổ sung thêm các ngày khác
];

const getShiftsByDate = (date) => {
  const d = dayjs(date).format("YYYY-MM-DD");
  return workSchedules.find((s) => s.date === d)?.shifts || [];
};

function FacilityScheduleWithAssign() {
  const [modal, setModal] = useState({ open: false, date: null, shifts: [] });
  const [assignments, setAssignments] = useState({}); // {caseId: staffName}

  const cellRender = (current, info) => {
    if (info.type === "date") {
      const shifts = getShiftsByDate(current);
      return (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {shifts.map((shift, idx) => (
            <li key={idx}>
              <Badge status="processing" text={shift.time + " - " + shift.staff} />
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  const onSelect = (date) => {
    const shifts = getShiftsByDate(date);
    if (shifts.length > 0) {
      setModal({ open: true, date: dayjs(date).format("DD/MM/YYYY"), shifts });
    }
  };

  const handleAssign = (caseId, staff) => {
    setAssignments(prev => ({ ...prev, [caseId]: staff }));
  };

  const handleSaveAssignments = () => {
    // Gọi API lưu assignments nếu cần
    Modal.success({ content: "Đã lưu phân công nhân viên cho hồ sơ!" });
    setModal({ ...modal, open: false });
  };

  return (
    <Card
      className="facility-schedule-card"
      title="Lịch làm việc của cơ sở"
      style={{ maxWidth: 900, margin: "0 auto", marginTop: 32 }}
    >
      <Calendar
        cellRender={cellRender}
        onSelect={onSelect}
        fullscreen={true}
      />
      <Modal
        open={modal.open}
        title={`Lịch làm việc ngày ${modal.date}`}
        onCancel={() => setModal({ ...modal, open: false })}
        footer={[
          <Button key="save" type="primary" onClick={handleSaveAssignments}>
            Lưu phân công
          </Button>
        ]}
        width={700}
      >
        {modal.shifts.map((shift, idx) => (
          <div key={idx} style={{ marginBottom: 24 }}>
            <div>
              <Tag color="blue">{shift.time}</Tag>
              <span style={{ marginLeft: 8, fontWeight: 500 }}>Nhân viên ca: {shift.staff}</span>
            </div>
            <List
              dataSource={shift.cases}
              renderItem={(cs) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <span>
                        <Tag color="purple">{cs.caseId}</Tag>
                        {cs.caseName} &mdash; <i>Khách: {cs.customer}</i>
                      </span>
                    }
                    description={
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span>Phân công xử lý:&nbsp;</span>
                        <Select
                          style={{ width: 180 }}
                          value={assignments[cs.caseId] ?? cs.assignedStaff ?? ""}
                          onChange={staff => handleAssign(cs.caseId, staff)}
                          placeholder="Chọn nhân viên"
                          options={staffList.map(name => ({ label: name, value: name }))}
                          allowClear
                        />
                        {assignments[cs.caseId] || cs.assignedStaff ? (
                          <Tag color="green">Đã phân công</Tag>
                        ) : (
                          <Tag color="red">Chưa phân công</Tag>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        ))}
      </Modal>
    </Card>
  );
}

export default FacilityScheduleWithAssign;
