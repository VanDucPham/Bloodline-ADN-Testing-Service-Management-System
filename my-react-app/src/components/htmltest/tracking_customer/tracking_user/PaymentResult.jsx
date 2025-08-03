import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "../../../../service/api"; // Cập nhật đúng path của bạn

import "./PaymentResult.css"; // File CSS riêng nếu có

function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState("processing"); // 'processing' | 'success' | 'failed'
  const [message, setMessage] = useState("Đang xử lý kết quả thanh toán...");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const responseCode = query.get("vnp_ResponseCode");

    const createAppointment = async () => {
      if (responseCode === "00") {
        try {
          // Lấy dữ liệu từ localStorage
          const appointment = JSON.parse(localStorage.getItem("appointment"));
          const participants = JSON.parse(localStorage.getItem("participants"));
          const samples = JSON.parse(localStorage.getItem("sample"));
          const caseFile = JSON.parse(localStorage.getItem("caseFile"));
          const payment = JSON.parse(localStorage.getItem("payment"));

          // === Debug log ===
          console.log("=== DEBUG LOG ===");
          console.log("appointment:", appointment);
          console.log("participants:", participants);
          console.log("samples:", samples);
          console.log("caseFile:", caseFile);
          console.log("payment:", payment);

          // Kiểm tra dữ liệu bắt buộc
          if (!appointment || !participants || !samples || !caseFile || !payment) {
            console.error("❌ Thiếu dữ liệu cần thiết để tạo lịch hẹn!");
            setStatus("failed");
            setMessage("❌ Thiếu thông tin cần thiết. Vui lòng đặt lịch lại.");
            setTimeout(() => navigate("/booking"), 3000);
            return;
          }

          // Tạo payload
          const payload = { appointment, participants, samples, caseFile, payment };
          console.log("Payload gửi API:", payload);

          // Gọi API tạo lịch hẹn
          await apiService.user.create_app(payload);

          // Nếu thành công
          setStatus("success");
          setMessage("🎉 Thanh toán thành công và lịch hẹn đã được tạo!");
          // Xoá dữ liệu tạm
          localStorage.removeItem("appointment");
          localStorage.removeItem("participants");
          localStorage.removeItem("sample");
          localStorage.removeItem("caseFile");
          localStorage.removeItem("payment");

          // Điều hướng sau 3s
          setTimeout(() => navigate("/tracking_user"), 3000);
        } catch (err) {
          console.error("Lỗi khi gọi API:", err);
          setStatus("failed");
          setMessage("❌ Lỗi khi tạo lịch hẹn. Vui lòng thử lại.");
          setTimeout(() => navigate("/booking"), 3000);
        }
      } else {
        setStatus("failed");
        setMessage("❌ Thanh toán thất bại hoặc bị hủy.");
        setTimeout(() => navigate("/booking"), 3000);
      }
    };

    createAppointment();
  }, [location, navigate]);

  return (
    <div className="payment-result-container">
      <div className={`payment-box ${status}`}>
        {status === "processing" && <div className="loader" />}
        <h2>Kết quả thanh toán</h2>
        <p>{message}</p>
        <p className="redirect-note">Bạn sẽ được chuyển trang trong giây lát...</p>
      </div>
    </div>
  );
}

export default PaymentResult;
