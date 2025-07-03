import React, { useEffect, useState } from 'react';
import { apiService } from '../../service/api';

const emptySlot = { startTime: '', endTime: '', maxAppointments: 1, oldStartTime: '', oldEndTime: '' };

export default function TimeSlotLimitAdmin() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState(emptySlot);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Check admin role (giả định lưu role trong localStorage)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user || user.role !== 'ADMIN') {
      setMessage('Bạn không có quyền truy cập trang này!');
    } else {
      fetchSlots();
    }
  }, []);

  const fetchSlots = async () => {
    try {
      const data = await apiService.admin.getAllTimeSlots();
      setSlots(data);
    } catch (err) {
      setMessage('Không thể tải danh sách khung giờ.');
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      if (editing) {
        const requestData = {
          oldStartTime: form.oldStartTime,
          oldEndTime: form.oldEndTime,
          startTime: form.startTime,
          endTime: form.endTime,
          maxAppointments: parseInt(form.maxAppointments)
        };
        await apiService.admin.updateTimeSlot(requestData);
        setMessage('Cập nhật thành công!');
      } else {
        await apiService.admin.createTimeSlot({
          startTime: form.startTime,
          endTime: form.endTime,
          maxAppointments: parseInt(form.maxAppointments)
        });
        setMessage('Tạo mới thành công!');
      }
      setForm(emptySlot);
      setEditing(false);
      fetchSlots();
    } catch (err) {
      setMessage(err.response?.data?.error || err.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = slot => {
    setForm({
      oldStartTime: slot.startTime,
      oldEndTime: slot.endTime,
      startTime: slot.startTime,
      endTime: slot.endTime,
      maxAppointments: slot.maxAppointments
    });
    setEditing(true);
    setMessage('');
  };

  const handleDelete = async (startTime, endTime) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa?')) return;
    try {
      await apiService.admin.deleteTimeSlot(startTime, endTime);
      setMessage('Xóa thành công!');
      fetchSlots();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Xóa thất bại!');
    }
  };

  if (message && message.includes('không có quyền')) {
    return <div style={{color:'red',padding:'2rem'}}>{message}</div>;
  }

  return (
    <div style={{maxWidth:600,margin:'2rem auto',background:'#fff',padding:24,borderRadius:8,boxShadow:'0 2px 8px #eee'}}>
      <h2>Quản lý khung giờ giới hạn (Admin)</h2>
      {message && <div style={{color: message.includes('thành công') ? 'green' : 'red'}}>{message}</div>}
      <form onSubmit={handleSubmit} style={{marginBottom:24}}>
        <div>
          <label>Bắt đầu: <input name="startTime" value={form.startTime} onChange={handleChange} required type="time" /></label>
        </div>
        <div>
          <label>Kết thúc: <input name="endTime" value={form.endTime} onChange={handleChange} required type="time" /></label>
        </div>
        <div>
          <label>Số lịch hẹn tối đa: <input name="maxAppointments" value={form.maxAppointments} onChange={handleChange} required type="number" min={1} /></label>
        </div>
        <button className="btn" type="submit" disabled={loading}>{editing ? (loading ? 'Đang cập nhật...' : 'Cập nhật') : (loading ? 'Đang tạo...' : 'Tạo mới')}</button>
        {editing && <button type="button" className="btn" style={{marginLeft:8}} onClick={()=>{setForm(emptySlot);setEditing(false);}}>Hủy</button>}
      </form>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr style={{background:'#f3f4f6'}}>
            <th>Bắt đầu</th>
            <th>Kết thúc</th>
            <th>Số lịch hẹn tối đa</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {slots && slots.length > 0 ? slots.map((slot, idx) => (
            <tr key={idx}>
              <td>{slot.startTime}</td>
              <td>{slot.endTime}</td>
              <td>{slot.maxAppointments}</td>
              <td>
                <button className="btn" onClick={()=>handleEdit(slot)}>Sửa</button>
                <button className="btn logout-btn" style={{marginLeft:8}} onClick={()=>handleDelete(slot.startTime, slot.endTime)}>Xóa</button>
              </td>
            </tr>
          )) : <tr><td colSpan={4} style={{textAlign:'center'}}>Không có dữ liệu</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
