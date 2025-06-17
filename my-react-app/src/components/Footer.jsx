import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="vietcare-footer">
      <div className="footer-column">
        <h2 className="footer-logo">Vietcare</h2>
        <p className="footer-desc">
          Viện Nghiên Cứu Khoa Học Và<br />
          Ứng Dụng Công Nghệ Vietcare
        </p>
      </div>

      <div className="footer-column">
        <h4 className="footer-title">DỊCH VỤ</h4>
        <ul className="footer-links">
          <li>› Xét nghiệm ADN huyết thống</li>
          <li>› Xét nghiệm sàng lọc NIPT</li>
          <li>› Xét nghiệm sinh hóa máu</li>
          <li>› Xét nghiệm sàng lọc ung thư</li>
        </ul>
      </div>

      <div className="footer-column">
        <h4 className="footer-title">ĐẶT LỊCH</h4>
        <p>Hãy để lại thông tin liên hệ, chuyên viên tư vấn của chúng tôi sẽ liên hệ lại ngay.</p>
        
      </div>

      <div className="footer-column">
        <h4 className="footer-title">LIÊN HỆ</h4>
        <p>Trụ sở: 38B đường 81, phường Tân Quy, quận 7, TP. Hồ Chí Minh</p>
        <p>0339 773 330 - 0338 773 330</p>
        <p>vietcarelab@gmail.com</p>
        <p>Hỗ trợ tư vấn 24/7</p>
      </div>
    </footer>
  );
}

export default Footer;
