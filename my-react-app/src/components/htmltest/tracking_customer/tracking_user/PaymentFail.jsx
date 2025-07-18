// PaymentFail.jsx
import { useLocation } from "react-router-dom";
function PaymentFail() {
  const query = new URLSearchParams(useLocation().search);
  return (
    <>
      <h2>❌ Thanh toán thất bại!</h2>
      <p>Mã lỗi: {query.get("code") || query.get("reason")}</p>
    </>
  );
}
