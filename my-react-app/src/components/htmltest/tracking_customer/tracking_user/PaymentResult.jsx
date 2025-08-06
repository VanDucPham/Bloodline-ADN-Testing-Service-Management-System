import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "../../../../service/api";
import "./PaymentResult.css";

function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Đang xử lý kết quả thanh toán...");
  const [notice, setNotice] = useState(""); // Thông báo động

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const responseCode = query.get("vnp_ResponseCode");

    const createAppointment = async () => {
      if (responseCode === "00") {
        try {
          const appointment = JSON.parse(localStorage.getItem("appointment"));
          const participants = JSON.parse(localStorage.getItem("participants"));
          const samples = JSON.parse(localStorage.getItem("sample"));
          const caseFile = JSON.parse(localStorage.getItem("caseFile"));
          const payment = JSON.parse(localStorage.getItem("payment"));

          if (!appointment || !participants || !samples || !caseFile || !payment) {
            setStatus("failed");
            setMessage("❌ Thiếu thông tin cần thiết. Vui lòng đặt lịch lại.");
            setTimeout(() => navigate("/booking"), 3000);
            return;
          }

          // Thiết lập thông báo theo hình thức lấy mẫu
          let customNotice = "";
          switch (appointment.deliveryMethod) {
            case "HOME_COLLECTION":
              customNotice =
                "Kit sẽ được gửi đến địa chỉ của bạn trong thời gian sớm nhất. Vui lòng chú ý điện thoại để nhận thông báo giao hàng.";
              break;
            case "SELF_DROP_OFF":
              customNotice =
                "Bạn đã đặt thành công dịch vụ. Vui lòng mang đầy đủ giấy tờ và người thân đến cơ sở vào đúng giờ hẹn. Nếu đến trễ, chúng tôi sẽ không chịu trách nhiệm về việc trễ lịch.";
              break;
            case "HOME_DELIVERY":
              customNotice =
                "Nhân viên của chúng tôi sẽ đến địa chỉ của bạn để lấy mẫu trong thời gian sớm nhất. Vui lòng chú ý điện thoại để nhận thông báo lịch hẹn.";
              break;
            default:
              customNotice = "Cảm ơn bạn đã đặt dịch vụ của chúng tôi.";
          }
          setNotice(customNotice);

          // Gọi API tạo lịch hẹn
          const payload = { appointment, participants, samples, caseFile, payment };
          await apiService.user.create_app(payload);

          setStatus("success");
          setMessage("🎉 Thanh toán thành công và lịch hẹn đã được tạo!");
          localStorage.removeItem("appointment");
          localStorage.removeItem("participants");
          localStorage.removeItem("sample");
          localStorage.removeItem("caseFile");
          localStorage.removeItem("payment");

          // Chờ người dùng đọc thông báo rồi tự điều hướng
          setTimeout(() => navigate("/CustomerApointmentList"), 8000);
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
        {status === "success" && notice && (
          <div className="notice-box">
            <h3>Thông báo quan trọng</h3>
            <p>{notice}</p>
          </div>
        )}
        {status !== "processing" && (
          <p className="redirect-note">
            Bạn sẽ được chuyển sang trang quản lý lịch hẹn trong giây lát...
          </p>
        )}
      </div>
    </div>
  );
}

export default PaymentResult;
