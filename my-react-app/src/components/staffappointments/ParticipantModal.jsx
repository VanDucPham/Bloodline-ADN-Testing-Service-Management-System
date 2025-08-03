import React, { useEffect, useState } from 'react';
import {
  Modal,
  Table,
  Typography,
  Spin,
  Alert,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
} from 'antd';
import { UsergroupAddOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const today = new Date().toISOString().split('T')[0];


function ParticipantModal({
  open,
  onClose,
  participants,
  onShowSample,
  sampleLoading,
  sampleError,
  selectedSample,
  onAddParticipant, // Hàm thêm participant (nhận mảng participant)
  onCreateSample,
  onUpdateSample,
  editingSample,
  onEditSample,
  onCancelEditSample,
  showCreateSample,
  onShowCreateSampleForm,
  onCancelCreateSample,
  createSampleLoading,
  createSampleError,
  createSampleSuccess,
  allowShowSample,
  allowAddParticipant,
  service, // Thêm prop service để lấy thông tin participantType
}) {
  const [sampleForm] = Form.useForm();

  // State quản lý hiển thị form thêm participant
  const [showAddParticipantForm, setShowAddParticipantForm] = useState(false);

  // State quản lý form thuần thêm nhiều participant
  const [newParticipants, setNewParticipants] = useState([]);

  // Khởi tạo form dựa trên participantsType của service
  useEffect(() => {
    if (service && service.participantsType && service.participantsType.length > 0) {
      const initialParticipants = service.participantsType.map(participantType => ({
        name: '',
        relationship: participantType.participantName, // Sử dụng participantName làm relationship
        gender: '',
        citizenId: '',
        address: '',
        birthDate: '',
      }));
      setNewParticipants(initialParticipants);
    } else {
      // Fallback nếu không có participantsType
      setNewParticipants([
        { name: '', relationship: '', gender: '', citizenId: '', address: '', birthDate: '' },
      ]);
    }
  }, [service]);

  // Đồng bộ dữ liệu khi chỉnh sửa sample
  useEffect(() => {
    if (editingSample) {
      sampleForm.setFieldsValue({
        quality: editingSample.quality,
        status: editingSample.status,
        result: editingSample.result,
        notes: editingSample.notes,
      });
    } else {
      sampleForm.resetFields();
    }
  }, [editingSample, sampleForm]);

  // Xử lý thay đổi input form thuần
  const handleNewParticipantChange = (index, e) => {
    const { name, value } = e.target;
    setNewParticipants((prev) => {
      const updated = [...prev];
      updated[index][name] = value;
      return updated;
    });
  };

  // Thêm dòng participant mới (chỉ khi không có participantsType từ service)
  const addNewParticipantRow = () => {
    if (!service || !service.participantsType || service.participantsType.length === 0) {
      setNewParticipants((prev) => [
        ...prev,
        { name: '', relationship: '', gender: '', citizenId: '', address: '', birthDate: '' },
      ]);
    }
  };

  // Xóa dòng participant theo index (chỉ khi không có participantsType từ service)
  const removeNewParticipantRow = (index) => {
    if (!service || !service.participantsType || service.participantsType.length === 0) {
      setNewParticipants((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Xử lý submit form thuần thêm nhiều participant
  const handleAddParticipants = async (e) => {
    e.preventDefault();
    // Validate đơn giản
    for (const p of newParticipants) {
      if (
        !p.name.trim() ||
        !p.relationship.trim() ||
        !p.gender ||
        !p.citizenId.trim() ||
        !p.address.trim() ||
        !p.birthDate
      ) {
        alert('Vui lòng điền đầy đủ thông tin tất cả người tham gia');
        return;
      }
    }
    try {
      await onAddParticipant(newParticipants);
      // Reset form sau khi thêm thành công
      if (service && service.participantsType && service.participantsType.length > 0) {
        const initialParticipants = service.participantsType.map(participantType => ({
          name: '',
          relationship: participantType.participantName,
          gender: '',
          citizenId: '',
          address: '',
          birthDate: '',
        }));
        setNewParticipants(initialParticipants);
      } else {
        setNewParticipants([{ name: '', relationship: '', gender: '', citizenId: '', address: '', birthDate: '' }]);
      }
      setShowAddParticipantForm(false); // Ẩn form sau khi thêm thành công
    } catch (error) {
      alert('Lỗi khi thêm participant');
    }
  };

  // Cột bảng participant
  const columns = [
    {
      title: 'ID',
      dataIndex: 'participantId',
      key: 'participantId',
      width: 80,
      render: (id) => <span>{id}</span>,
    },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Quan hệ', dataIndex: 'relationship', key: 'relationship' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address', responsive: ['md'] },
    { title: 'Ngày sinh', dataIndex: 'birthDate', key: 'birthDate' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { title: 'CCCD', dataIndex: 'citizenId', key: 'citizenId', responsive: ['md'] },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button onClick={() => onShowSample(record.participantId)}
          disabled={!allowShowSample}
          title={!allowShowSample ? 'Chỉ xem sample khi lịch đang thực hiện và hoàn thành thu kit' : ''}>
          Xem sample
        </Button>
      ),
    },
  ];

  // Xử lý submit form tạo sample
  const onFinishCreateSample = (values) => {
    onCreateSample(values);
  };

  // Xử lý submit form cập nhật sample
  const onFinishUpdateSample = (values) => {
    onUpdateSample(values);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      title={
        <span>
          <UsergroupAddOutlined style={{ color: '#722ed1', marginRight: 8, fontSize: 22 }} />{' '}
          <b>Danh sách người tham gia</b>
        </span>
      }
      centered
      bodyStyle={{ paddingTop: 12 }}
    >
      {/* Nút thêm participant bật form */}
      <Button
        type="primary"
        style={{ marginBottom: 12 }}
        onClick={() => setShowAddParticipantForm(true)}
        disabled={!allowAddParticipant}
        title={!allowAddParticipant ? 'Chỉ thêm được người tham gia khi thực hiện' : ''}
      >
        Thêm participant
      </Button>

      {/* Form thêm participant chỉ hiển thị khi bật */}
      {showAddParticipantForm && (
        <div>
          {service && service.participantsType && service.participantsType.length > 0 ? (
            <div style={{ marginBottom: 16 }}>
              <Alert 
                message={`Dịch vụ này yêu cầu ${service.participantsType.length} người tham gia: ${service.participantsType.map(pt => pt.participantName).join(', ')}`} 
                type="info" 
                showIcon 
              />
            </div>
          ) : (
            <p>Không có participant nào! Hãy thêm participant</p>
          )}
          
          <form onSubmit={handleAddParticipants} className="participant-form">
            {newParticipants.map((p, idx) => (
              <div key={idx} className="participant-row" style={{ marginBottom: 10 }}>
                <input
                  name="name"
                  placeholder="Họ tên"
                  value={p.name}
                  onChange={(e) => handleNewParticipantChange(idx, e)}
                  required
                />
                <input
                  name="relationship"
                  placeholder="Quan hệ"
                  value={p.relationship}
                  onChange={(e) => handleNewParticipantChange(idx, e)}
                  required
                  readOnly={service && service.participantsType && service.participantsType.length > 0}
                  style={service && service.participantsType && service.participantsType.length > 0 ? { backgroundColor: '#f5f5f5' } : {}}
                />
                <select
                  name="gender"
                  value={p.gender}
                  onChange={(e) => handleNewParticipantChange(idx, e)}
                  required
                >
                  <option value="">Giới tính</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
                <input
                  name="citizenId"
                  placeholder="CMND/CCCD"
                  value={p.citizenId}
                  onChange={(e) => handleNewParticipantChange(idx, e)}
                  required
                />
                <input
                  name="address"
                  placeholder="Địa chỉ"
                  value={p.address}
                  onChange={(e) => handleNewParticipantChange(idx, e)}
                  required
                />
                <input
                  name="birthDate"
                  type="date"
                  placeholder="Ngày sinh"
                  value={p.birthDate}
                  max={today} // Giới hạn ngày sinh không được lớn hơn hôm nay
                  onChange={(e) => handleNewParticipantChange(idx, e)}
                  required
                />
                {/* Chỉ hiển thị nút xóa/thêm khi không có participantsType từ service */}
                {(!service || !service.participantsType || service.participantsType.length === 0) && (
                  <>
                    <button
                      type="button"
                      onClick={() => removeNewParticipantRow(idx)}
                      disabled={newParticipants.length === 1}
                      style={{ marginLeft: 5 }}
                    >
                      -
                    </button>
                    {idx === newParticipants.length - 1 && (
                      <button type="button" onClick={addNewParticipantRow} style={{ marginLeft: 5 }}>
                        +
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
            <button type="submit" style={{ marginTop: 10 }}>
              Lưu người tham gia
            </button>
            <button
              type="button"
              onClick={() => setShowAddParticipantForm(false)}
              style={{ marginLeft: 8 }}
            >
              Hủy
            </button>
          </form>
        </div>
      )}

      {/* Bảng danh sách participant */}
      {Array.isArray(participants) && participants.length > 0 ? (
        <Table
          dataSource={participants}
          columns={columns}
          rowKey="participantId"
          pagination={false}
          size="middle"
          bordered
        />
      ) : (
        <Alert message="Không có participant nào!" type="info" showIcon style={{ marginBottom: 16 }} />
      )}

      {/* Phần hiển thị sample */}
      {sampleLoading && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Spin tip="Đang tải sample..." />
        </div>
      )}
      {sampleError && <Alert message={sampleError} type="error" showIcon style={{ marginTop: 16 }} />}

      {selectedSample && (
        <div className="staff-sample-info" style={{ marginTop: 24 }}>
          <Title level={5} style={{ marginBottom: 8 }}>
            🧪 Sample của participant <Text code>{selectedSample.participantId}</Text>
          </Title>

          {(!selectedSample.data || !selectedSample.data.sampleId) ? (
            !showCreateSample ? (
              <Button type="primary" onClick={onShowCreateSampleForm}>
                Tạo sample
              </Button>
            ) : (
              <Form
                form={sampleForm}
                layout="vertical"
                onFinish={onFinishCreateSample}
                style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}
              >
                <Form.Item name="sampleType" label="Loại mẫu" rules={[{ required: true }]}>
                  <Select placeholder="Chọn loại mẫu">
                    <Option value="BLOOD">Máu (BLOOD)</Option>
                    <Option value="SALIVA">Nước bọt (SALIVA)</Option>
                    <Option value="HAIR">Tóc (HAIR)</Option>
                    <Option value="OTHER">Khác (OTHER)</Option>
                  </Select>
                </Form.Item>
                {/* Bỏ phần chọn thời gian lấy mẫu nếu backend tự lấy */}
                {/* Bỏ phần chọn chất lượng nếu không cần */}
                <Form.Item name="notes" label="Ghi chú">
                  <Input.TextArea />
                </Form.Item>
                {createSampleError && <Alert type="error" message={createSampleError} />}
                {createSampleSuccess && <Alert type="success" message={createSampleSuccess} />}
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={createSampleLoading}>
                    Lưu sample
                  </Button>{' '}
                  <Button onClick={onCancelCreateSample}>Hủy</Button>
                </Form.Item>
              </Form>
            )
          ) : (
            <>
              <Table
                dataSource={[selectedSample.data]}
                pagination={false}
                size="small"
                bordered
                columns={[
                  { title: 'ID', dataIndex: 'sampleId', key: 'sampleId', render: (v) => <Text code>{v}</Text> },
                  { title: 'Loại', dataIndex: 'sampleType', key: 'sampleType' },
                  {
                    title: 'Thời gian',
                    dataIndex: 'collectionDateTime',
                    key: 'collectionDateTime',
                    render: (value) => {
                      if (!value) return '';
                      const m = moment(value);
                      if (!m.isValid()) {
                        console.warn('Invalid date value:', value);
                        return '';
                      }
                      return m.format('YYYY-MM-DD HH:mm:ss');
                    }

                  },
                  { title: 'Chất lượng', dataIndex: 'quality', key: 'quality' },
                  { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
                  { title: 'Kết quả', dataIndex: 'result', key: 'result' },
                  { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
                ]}
              />
              {editingSample && editingSample.sampleId === selectedSample.data.sampleId ? (
                <Form
                  form={sampleForm}
                  layout="vertical"
                  onFinish={onFinishUpdateSample}
                  style={{ marginTop: 16, border: '1px solid #ccc', padding: 16, borderRadius: 8 }}
                >
                  <Form.Item name="quality" label="Chất lượng" rules={[{ required: true }]}>
                    <Select>
                      <Option value="POOR">POOR</Option>
                      <Option value="FAIR">FAIR</Option>
                      <Option value="GOOD">GOOD</Option>
                      <Option value="EXCELLENT">EXCELLENT</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="result" label="Kết quả">
                    <Input />
                  </Form.Item>
                  <Form.Item name="notes" label="Ghi chú">
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Lưu
                    </Button>{' '}
                    <Button onClick={onCancelEditSample}>Hủy</Button>
                  </Form.Item>
                </Form>
              ) : (
                <Button type="primary" style={{ marginTop: 16 }} onClick={() => onEditSample(selectedSample.data)}>
                  Sửa sample
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </Modal>
  );
}

export default ParticipantModal;
