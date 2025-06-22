package com.example.Bloodline_ADN_System.dto;

import lombok.*;

// DTO chứa thông tin để yêu cầu vô hiệu hóa một nhân viên
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeactivateStaffRequest {

    // ID của nhân viên cần vô hiệu hóa
    private Long userId;
}
