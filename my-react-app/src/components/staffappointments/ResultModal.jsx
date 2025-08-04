// src/components/ResultModal.jsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Alert, Typography, List } from 'antd';
import moment from 'moment';

const { Text } = Typography;

function ResultModal({ open, onClose, appointment, existingResult, onSaveResult, onExportResult }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && existingResult) {
      form.setFieldsValue({
        resultValue: existingResult.resultValue,
        notes: existingResult.notes,
      });
    } else {
      form.resetFields();
    }
  }, [open, existingResult, form]);

  if (!appointment) return null;

  const canEdit = appointment.appointmentStatus === 'COMPLETED';

  if (existingResult) {
    return (
      <Modal
        title={`Kết quả lịch hẹn #${appointment.appointmentId}`}
        open={open}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>Đóng</Button>,
          <Button key="export" onClick={() => onExportResult(appointment.appointmentId)}>Xuất PDF</Button>
        ]}
        centered
      >
        <p><b>Loại lịch hẹn:</b> {existingResult.appointmentType || '-'}</p>
        <p><b>Người tham gia:</b></p>
        <List
          dataSource={existingResult.participants || []}
          renderItem={(p) => <List.Item><Text>{p}</Text></List.Item>}
        />
        <p><b>Kết quả:</b> {existingResult.resultValue}</p>
        <p><b>Ngày kết quả:</b> {existingResult.resultDate ? moment(existingResult.resultDate).format('DD/MM/YYYY HH:mm:ss') : '-'}</p>
        <p><b>Trạng thái:</b> {existingResult.status || '-'}</p>
        <p><b>Ghi chú:</b> {existingResult.notes || '-'}</p>
      </Modal>
    );
  }

  if (!canEdit) {
    return (
      <Modal title="Thông báo" open={open} onCancel={onClose} footer={null}>
        <Alert message="Chỉ có thể nhập kết quả khi lịch hẹn đã hoàn thành" type="warning" />
      </Modal>
    );
  }

  return (
    <Modal title={`Nhập kết quả cho lịch hẹn #${appointment.appointmentId}`} open={open} onCancel={onClose} footer={null} centered>
      <Form form={form} layout="vertical" onFinish={onSaveResult}>
        <Form.Item name="resultValue" label="Kết quả" rules={[{ required: true, message: 'Vui lòng nhập kết quả' }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="notes" label="Ghi chú">
          <Input.TextArea rows={2} maxLength={255} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Lưu kết quả</Button>{' '}
          <Button onClick={onClose}>Hủy</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ResultModal;
