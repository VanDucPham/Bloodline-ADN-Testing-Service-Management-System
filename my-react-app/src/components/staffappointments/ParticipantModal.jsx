// src/components/ParticipantModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Table, Button, Form, Input, Select, DatePicker, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const today = moment();

function ParticipantModal({ open, onClose, participants, onAddParticipant, allowAddParticipant }) {
  const [form] = Form.useForm();

  const handleAddParticipants = async () => {
    try {
      const values = await form.validateFields();
      const newParticipants = values.participants.map(p => ({
        ...p,
        birthDate: p.birthDate.format('YYYY-MM-DD')
      }));
      await onAddParticipant(newParticipants);
      message.success('Thêm participant thành công');
      form.resetFields();
    } catch (err) {
      message.error('Vui lòng nhập đầy đủ thông tin');
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Danh sách người tham gia"
      footer={null}
      width={800}
    >
      <Form form={form} layout="vertical">
        <Form.List name="participants" initialValue={[{ name: '', relationship: '', gender: '', citizenId: '', address: '', birthDate: null }]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true, message: 'Nhập tên' }]}>
                    <Input placeholder="Tên" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'relationship']} rules={[{ required: true, message: 'Nhập quan hệ' }]}>
                    <Input placeholder="Quan hệ" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'gender']} rules={[{ required: true }]}>
                    <Select placeholder="Giới tính">
                      <Option value="MALE">Nam</Option>
                      <Option value="FEMALE">Nữ</Option>
                      <Option value="OTHER">Khác</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'citizenId']} rules={[{ required: true, pattern: /^\d{12}$/, message: 'CCCD 12 số' }]}>
                    <Input placeholder="CMND/CCCD" maxLength={12} />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'address']} rules={[{ required: true }]}>
                    <Input placeholder="Địa chỉ" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'birthDate']} rules={[{ required: true }]}>
                    <DatePicker placeholder="Ngày sinh" disabledDate={(d) => d && d > today} />
                  </Form.Item>
                  <Button type="text" danger onClick={() => remove(name)}>-</Button>
                </div>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Thêm người tham gia
              </Button>
            </>
          )}
        </Form.List>
      </Form>
      <Button type="primary" onClick={handleAddParticipants} disabled={!allowAddParticipant} style={{ marginTop: 16 }}>
        Lưu participant
      </Button>
    </Modal>
  );
}

export default ParticipantModal;
