import React from 'react';

function UserPage() {
  return (
    <div className="user-page">
      <h2>🧑‍💼 Trang Người Dùng Cá Nhân</h2>
      <ul>
        <li>Đăng ký tài khoản, đăng nhập (JWT)</li>
        <li>Quản lý thông tin cá nhân, đổi mật khẩu</li>
        <li>Tạo hồ sơ xét nghiệm tại cơ sở</li>
        <li>Đăng ký dịch vụ, chọn loại, hình thức lấy mẫu</li>
        <li>Tích hợp thanh toán MoMo</li>
        <li>Xem kết quả xét nghiệm (PDF, gửi email)</li>
        <li>Nhận email xác nhận kết quả</li>
        <li>Đánh giá dịch vụ: sao, nhận xét</li>
      </ul>
    </div>
  );
}

export default UserPage;