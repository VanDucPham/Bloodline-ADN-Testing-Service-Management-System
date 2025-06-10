import React from 'react';

function ManagerPage() {
  return (
    <div className="manager-page">
      <h2>👨‍💼 Trang Quản Lý Cơ Sở/Dịch Vụ</h2>
      <ul>
        <li>Đăng nhập bằng tài khoản Manager</li>
        <li>Quản lý tiến trình mẫu toàn hệ thống</li>
        <li>Xem thống kê: số lượt đăng ký, mẫu đang xử lý, kết quả đã trả</li>
        <li>Xem và xuất báo cáo PDF/Excel</li>
        <li>Theo dõi đánh giá trung bình, nhận xét của khách hàng</li>
      </ul>
    </div>
  );
}

export default ManagerPage;