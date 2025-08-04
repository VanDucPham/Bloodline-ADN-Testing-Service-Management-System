import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Button, message } from "antd";
import apiService from "../../service/api";

const PaymentManager = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiService.manager.getAllPayments();
        setPayments(res.sort((a, b) => b.paymentId - a.paymentId)); // Sắp xếp giảm dần
      } catch (e) {
        setError("Không thể tải danh sách thanh toán!");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);


  const columns = [
    { title: "Mã thanh toán", dataIndex: "paymentId", key: "paymentId" },
    { title: "Tên người thanh toán", dataIndex: "customerName", key: "customerName" },
    { title: "Mã phiếu yêu cầu", dataIndex: "appointmentId", key: "appointmentId" },
    { title: "Số tiền", dataIndex: "amount", key: "amount" },
    { title: "Thời gian thanh toán", dataIndex: "paymentDate", key: "paymentDate" },
    { title: "Phương thức", dataIndex: "paymentMethod", key: "paymentMethod" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    
  ];

  return (
    <div>
      <h2>Quản lý thanh toán</h2>
      {loading ? (
        <Spin tip="Đang tải danh sách thanh toán..." />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <Table
          dataSource={payments}
          columns={columns}
          rowKey="paymentId"
          bordered
        />
      )}
    </div>
  );
};

export default PaymentManager;