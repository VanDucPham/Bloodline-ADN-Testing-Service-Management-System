// src/components/ParticipantModal.jsx
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Table,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Spin,
  Alert,
  Typography
} from 'antd';
import { PlusOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { Title, Text } = Typography;
const today = moment();

function ParticipantModal({
  open,
  onClose,
  participants,
  onShowSample,
  sampleLoading,
  sampleError,
  selectedSample,
  onAddParticipant,
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
  service,
  showAddParticipantForm,
  onShowAddParticipantForm,
  addParticipantLoading,
  addParticipantError,
  addParticipantSuccess,
  participantCount,
}) {
  const [sampleForm] = Form.useForm();
  const [participantForm] = Form.useForm();
  const [newParticipants, setNewParticipants] = useState([]);

  // Khởi tạo form participant theo service
  useEffect(() => {
    if (service && service.participantsType && service.participantsType.length > 0) {
      const initialParticipants = service.participantsType.map((pt) => ({
        name: '',
        relationship: pt.participantType,
        citizenId: '',
        address: '',
        birthDate: null,
      }));
      setNewParticipants(initialParticipants);
    } else {
      setNewParticipants([{ name: '', relationship: '', citizenId: '', address: '', birthDate: null }]);
    }
  }, [service]);

  // Đồng bộ khi edit sample
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

  const handleAddParticipants = async () => {
    try {
      const values = await participantForm.validateFields();
      await onAddParticipant(values.participants);
      participantForm.resetFields();
      message.success('Thêm người tham gia thành công');
    } catch (error) {
      console.error('Error in handleAddParticipants:', error);
      message.error('Lỗi khi thêm participant');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'participantId', key: 'participantId', width: 80 },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Quan hệ', dataIndex: 'relationship', key: 'relationship' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address', responsive: ['md'] },
    { title: 'Ngày sinh', dataIndex: 'birthDate', key: 'birthDate' },
    { title: 'CCCD', dataIndex: 'citizenId', key: 'citizenId', responsive: ['md'] },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          onClick={() => onShowSample(record.participantId)}
          disabled={!allowShowSample}
          title={!allowShowSample ? 'Chỉ xem sample khi lịch đang thực hiện và hoàn thành thu kit' : ''}
        >
          Xem sample
        </Button>
      ),
    },
  ];

  const onFinishCreateSample = (values) => {
    onCreateSample(values);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      title={
        <span>
          <UsergroupAddOutlined style={{ color: '#722ed1', marginRight: 8, fontSize: 22 }} />{' '}
          <b>Danh sách người tham gia</b>
        </span>
      }
    >
      {/* Nút bật form thêm participant */}
      {(!participants || participants.length === 0) && (
        <Button
          type="primary"
          style={{ marginBottom: 12 }}
          onClick={onShowAddParticipantForm}
          disabled={!allowAddParticipant}
          title={!allowAddParticipant ? 'Chỉ thêm được người tham gia khi thực hiện' : ''}
        >
          Thêm participant
        </Button>
      )}

      {/* Form thêm participant */}
      {showAddParticipantForm && (
        <div>
          {service && service.participantsType && service.participantsType.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Alert
                message={`Dịch vụ này yêu cầu ${service.participantsType.length} người tham gia: ${service.participantsType
                  .map((pt) => pt.participantType)
                  .join(', ')}`}
                type="info"
                showIcon
              />
            </div>
          )}
          {addParticipantError && <Alert message={addParticipantError} type="error" showIcon style={{ marginBottom: 16 }} />}
          {addParticipantSuccess && <Alert message={addParticipantSuccess} type="success" showIcon style={{ marginBottom: 16 }} />}

          <Form form={participantForm} layout="vertical">
            <Form.List name="participants" initialValue={newParticipants}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, idx) => (
                    <div key={key} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                      <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true, message: 'Nhập họ tên' }]} style={{ flex: 1 }}>
                        <Input placeholder="Họ tên" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'relationship']} rules={[{ required: true, message: 'Nhập quan hệ' }]} style={{ flex: 1 }}>
                        <Input placeholder="Quan hệ" readOnly={!!(service && service.participantsType && service.participantsType.length > 0)} />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'citizenId']} rules={[{ required: true, message: 'Nhập CMND/CCCD' }]} style={{ flex: 1 }}>
                        <Input placeholder="CMND/CCCD" maxLength={12} />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'address']} rules={[{ required: true, message: 'Nhập địa chỉ' }]} style={{ flex: 2 }}>
                        <Input placeholder="Địa chỉ" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'birthDate']} rules={[{ required: true, message: 'Chọn ngày sinh' }]} style={{ flex: 1 }}>
                        <DatePicker placeholder="Ngày sinh" disabledDate={(d) => d && d > today} style={{ width: '100%' }} />
                      </Form.Item>
                      {(!service || !service.participantsType || service.participantsType.length === 0) && (
                        <Button type="text" danger onClick={() => remove(name)}>-</Button>
                      )}
                    </div>
                  ))}
                  {(!service || !service.participantsType || service.participantsType.length === 0) && (
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Thêm người tham gia
                    </Button>
                  )}
                </>
              )}
            </Form.List>
            <Button type="primary" onClick={handleAddParticipants} loading={addParticipantLoading} style={{ marginTop: 10 }}>
              Lưu người tham gia
            </Button>
            <Button type="default" onClick={onShowAddParticipantForm} style={{ marginLeft: 8 }}>
              Hủy
            </Button>
          </Form>
        </div>
      )}

      {/* Bảng danh sách participant */}
      {Array.isArray(participants) && participants.length > 0 ? (
        <Table dataSource={participants} columns={columns} rowKey="participantId" pagination={false} size="middle" bordered />
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

          {!selectedSample.data || !selectedSample.data.sampleId ? (
            !showCreateSample ? (
              <Button type="primary" onClick={onShowCreateSampleForm}>
                Tạo sample
              </Button>
            ) : (
              <Form form={sampleForm} layout="vertical" onFinish={onFinishCreateSample} style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
                <Form.Item name="sampleType" label="Loại mẫu" rules={[{ required: true }]}>
                  <Select placeholder="Chọn loại mẫu">
                    <Option value="BLOOD">Máu (BLOOD)</Option>
                    <Option value="SALIVA">Nước bọt (SALIVA)</Option>
                    <Option value="HAIR">Tóc (HAIR)</Option>
                    <Option value="OTHER">Khác (OTHER)</Option>
                  </Select>
                </Form.Item>
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
            <Alert message="Sample đã tồn tại" type="success" />
          )}
        </div>
      )}
    </Modal>
  );
}

export default ParticipantModal;
