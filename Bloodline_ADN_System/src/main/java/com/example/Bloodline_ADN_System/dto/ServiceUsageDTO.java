package com.example.Bloodline_ADN_System.dto;

import lombok.*;

// DTO trả về tên dịch vụ và số lượt sử dụng
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceUsageDTO {

    // Tên dịch vụ (ví dụ: Xét nghiệm huyết thống)
    private String serviceName;

    // Số lần dịch vụ đó được sử dụng
    private Long usageCount;
}
