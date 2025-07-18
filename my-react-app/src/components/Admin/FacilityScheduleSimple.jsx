import React, { useEffect, useState } from "react";
import { Calendar, Badge, Card, Modal, List, Select, Button, Tag, message } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import apiService from "../../service/api";

function FacilityScheduleWithAssign() {
  const [modal, setModal] = useState({ open: false, date: null, shifts: [] });
  const [assignments, setAssignments] = useState({});
  const [scheduleData, setScheduleData] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const translateDeliveryMethod = (method) => {
  switch (method) {
    case "HOME_COLLECTION": return "Tại nhà";
    case "HOME_DELIVERY": return "Nhân viên đến lấy";
    case "SELF_DROP_OFF": return "Gửi bưu điện";
    default: return method; // fallback nếu có giá trị lạ
  }
};

const translateAppointmentType = (type) => {
  switch (type) {
    case "CIVIL": return "DÂN SỰ";
    case "ADMINISTRATIVE": return "HÀNH CHÍNH";
    
    default: return type;
  }
};

  const fetchSchedule = async () => {
    try {
      const today = dayjs().format("YYYY-MM");
      const res = await apiService.admin.getscheduleByMonth(today);
      setScheduleData(res || []);
    } catch (err) {
      message.error("Không thể tải lịch làm việc");
    }
  };

  const fetchStaffList = async () => {
    try {
      const res = await apiService.admin.getStaffAssigned();
      console.log( "Danh sachsnhaan viên",res)
      const staff = res || [];
      setStaffList(staff.map(s => ({ label: s.staffName, value: s.staffCode })));
    } catch (err) {
      message.error("Không thể tải danh sách nhân viên");
    }
  };

  useEffect(() => {
    fetchSchedule();
    fetchStaffList();
  }, []);

  const getShiftsByDate = (date) => {
    const d = dayjs(date).format("YYYY-MM-DD");
    const dayData = scheduleData.find(s => s.day === d);
    console.log(dayData)
    return dayData?.cases || [];
  };

  const cellRender = (current, info) => {
    if (info.type === "date") {
      const shifts = getShiftsByDate(current);
      return (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {shifts.map((shift, idx) => (
            <li key={idx}>
              <Badge status="processing" text={`${shift.time} - ${shift.staff || "Chưa phân công"}`} />
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

  const handleAssign = (appointmentId, staffName) => {
    setAssignments(prev => ({ ...prev, [appointmentId]: staffName }));
  };

  const handleSaveAssignments = async () => {
    const payload = Object.entries(assignments).map(([appointmentId, staffCode]) => ({
      appointmentId: Number(appointmentId),
      staffCode,
    }));

    try {
      console.log(payload)
      await apiService.admin.addStaffAsigned(payload);
      
      message.success("Đã lưu phân công nhân viên!");
      setAssignments({});
      fetchSchedule();
      setModal({ ...modal, open: false });
    } catch (err) {
      message.error("Lỗi khi lưu phân công!");
      console.log(err)
    }
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
              <span style={{ marginLeft: 8, fontWeight: 500 }}>
                Nhân viên ca: {shift.staff || "Chưa phân công"}
              </span>
            </div>
            <List
              dataSource={shift.caseassignments}
              renderItem={(cs) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <span>
                        <Tag color="purple">#{cs.caseCode}</Tag>
                        &nbsp;Khách: {cs.customerName}
                      </span>
                    }
                   description={
  <>
    <div>
      <Tag color="geekblue">Hình thức: {translateDeliveryMethod(cs.deliveryMethod) }</Tag>
      <Tag color="volcano">Loại lịch hẹn: {translateAppointmentType(cs.appointmentType) }</Tag>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
      <span>Phân công:&nbsp;</span>
      <Select
        style={{ width: 180 }}
        value={assignments[cs.appointmentID] ?? cs.assignStaff ?? ""}
        onChange={(staffCode) => handleAssign(cs.appointmentID, staffCode)}
        placeholder="Chọn nhân viên"
        options={staffList}
        allowClear
      />
      {(assignments[cs.appointmentID] || cs.assignStaff) ? (
        <Tag color="green">Đã phân công</Tag>
      ) : (
        <Tag color="red">Chưa phân công</Tag>
      )}
    </div>
  </>
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
