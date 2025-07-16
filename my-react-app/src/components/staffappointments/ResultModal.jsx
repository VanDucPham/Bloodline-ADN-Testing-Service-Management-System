import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import moment from 'moment';


function ResultModal({ open, onClose, appointment, existingResult, onSaveResult, onExportResult }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
    if (existingResult) {
      form.setFieldsValue({
        resultValue: existingResult.resultValue,
        notes: existingResult.notes,
      });
    }
  }, [open, existingResult, form]);

  if (!appointment) return null;

  // Nếu đã có kết quả, chỉ hiển thị thông tin
  if (existingResult) {
    return (
      <Modal
        title={`Kết quả lịch hẹn #${appointment.appointmentId}`}
        open={open}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>
            Đóng
          </Button>,

          <Button key="export" onClick={() => onExportResult(appointment.appointmentId)}>
            Xuất PDF
          </Button>,


        ]}
        centered
      >
        <p><b>Loại lịch hẹn:</b></p>
        <p>{existingResult.appointmentType || '-'}</p>


        <p><b>Người tham gia:</b></p>
        <p>
  {existingResult.participants && existingResult.participants.length > 0
    ? existingResult.participants.join(', ')
    : '-'}
</p>


        <p><b>Kết quả:</b></p>
        <p>{existingResult.resultValue}</p>

        <p><b>Ngày kết quả:</b></p>
        <p>{existingResult.resultDate ? moment(existingResult.resultDate).format('DD/MM/YYYY HH:mm:ss') : '-'}</p>

        <p><b>Trạng thái:</b></p>
        <p>{existingResult.status || '-'}</p>

        <p><b>Ghi chú:</b></p>
        <p>{existingResult.notes || '-'}</p>
      </Modal>
    );
  }

  // Nếu chưa có kết quả, hiển thị form nhập
  return (
    <Modal
      title={`Nhập kết quả cho lịch hẹn #${appointment.appointmentId}`}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={onSaveResult}>
        <Form.Item
          name="resultValue"
          label="Kết quả"
          rules={[{ required: true, message: 'Vui lòng nhập kết quả' }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập kết quả ở đây..." />
        </Form.Item>
        <Form.Item name="notes" label="Ghi chú">
          <Input.TextArea rows={2} placeholder="Ghi chú thêm (nếu có)" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Lưu kết quả
          </Button>{' '}
          <Button onClick={onClose}>Hủy</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ResultModal;
