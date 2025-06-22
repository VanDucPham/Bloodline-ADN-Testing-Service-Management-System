package com.example.Bloodline_ADN_System.dto;

import lombok.*;

// DTO trả về thông tin nhân viên (staff)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffDTO {

    // ID của nhân viên
    private Long userId;

    // Tên đầy đủ của nhân viên
    private String name;

    // Email đăng nhập của nhân viên
    private String email;

    // Số điện thoại liên hệ
    private String phone;

    // Giới tính
    private String gender;

    // Địa chỉ nhân viên
    private String address;

    // Trạng thái hoạt động (ACTIVE hoặc INACTIVE)
    private String status;
}
