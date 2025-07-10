// src/pages/SystemSettings.jsx
import React, { useState } from "react";
import { Form, Input, Button, Card, message, Switch, Divider } from "antd";

const initialSettings = {
  siteName: "Hệ thống Xét nghiệm ADN",
  contactEmail: "info@adnlab.vn",
  contactPhone: "0339 773 330",
  address: "388 đường 81, phường Tân Quy, quận 7, TP. Hồ Chí Minh",
  theme: "light",
  maintenanceMode: false,
};

const SystemSettings = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [form] = Form.useForm();

  const handleSave = (values) => {
    setSettings({ ...settings, ...values });
    message.success("Đã lưu cấu hình hệ thống!");
  };

  return (
    <Card
      title="Cài đặt Hệ thống"
      style={{ maxWidth: 600, margin: "0 auto", marginTop: 32 }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={settings}
        onFinish={handleSave}
      >
        <Form.Item
          label="Tên hệ thống"
          name="siteName"
          rules={[{ required: true, message: "Vui lòng nhập tên hệ thống!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email liên hệ"
          name="contactEmail"
          rules={[
            { required: true, message: "Vui lòng nhập email liên hệ!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại liên hệ"
          name="contactPhone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input />
        </Form.Item>
        <Divider />
        <Form.Item label="Chủ đề giao diện" name="theme">
          <Input placeholder="light hoặc dark" />
        </Form.Item>
        <Form.Item
          label="Bảo trì hệ thống"
          name="maintenanceMode"
          valuePropName="checked"
        >
          <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Lưu cài đặt
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SystemSettings;
