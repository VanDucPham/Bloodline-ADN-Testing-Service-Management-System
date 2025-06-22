package com.example.Bloodline_ADN_System.dto;

import lombok.*;

// DTO trả về tổng doanh thu và khoảng thời gian tương ứng
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueResponse {

    // Tổng doanh thu tính được
    private Double totalRevenue;

    // Chuỗi mô tả thời gian: "Tháng 6/2025" hoặc "Năm 2025"
    private String period;
}
