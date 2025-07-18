import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "../../../../service/api"; // Cập nhật đúng path của bạn

import "./paymentResult.css"; // File CSS riêng nếu có

function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState("processing"); // 'processing' | 'success' | 'failed'
  const [message, setMessage] = useState("Đang xử lý kết quả thanh toán...");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const responseCode = query.get("vnp_ResponseCode");

    const createAppointment = async () => {
      if (responseCode === "00" || null) {
        try {
          const appointment = JSON.parse(localStorage.getItem("appointment"));
          const participants = JSON.parse(localStorage.getItem("participants"));
          const samples = JSON.parse(localStorage.getItem("sample"));
          const caseFile = JSON.parse(localStorage.getItem("caseFile"));
          const payment = JSON.parse(localStorage.getItem("payment"));
         
          
          const payload = {
            appointment,
            participants,
            samples,
            caseFile, 
            payment
            
          };
            console.log(payload)
          await apiService.user.create_app(payload);

          // Cleanup localStorage
       
          
          setStatus("success");
          setMessage("🎉 Thanh toán thành công và lịch hẹn đã được tạo!");
          //setTimeout(() => navigate("/tracking_user"), 3000);
        } catch (err) {
          setStatus("failed");
          console.log(err)
          setMessage("❌ Lỗi khi tạo lịch hẹn. Vui lòng thử lại.");
         // setTimeout(() => navigate("/booking"), 3000);
        }
      } else {
        setStatus("failed");
        setMessage("❌ Thanh toán thất bại hoặc bị hủy.");
       // setTimeout(() => navigate("/booking"), 3000);
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
