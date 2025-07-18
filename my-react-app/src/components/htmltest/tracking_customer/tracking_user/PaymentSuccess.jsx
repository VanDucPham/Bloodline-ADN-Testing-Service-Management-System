// routes: /payment-success, /payment-fail
// PaymentSuccess.jsx
import { useLocation } from "react-router-dom";
function PaymentSuccess() {
  const query = new URLSearchParams(useLocation().search);
  const orderId = query.get("orderId");
  return <h2>✅ Thanh toán thành công! Mã đơn: {orderId}</h2>;
}
