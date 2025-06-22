package com.example.Bloodline_ADN_System.dto;

import lombok.*;

// DTO yêu cầu tính doanh thu theo tháng hoặc theo năm
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueRequest {

    // Tháng muốn xem (ví dụ: 6 cho tháng 6) – optional nếu chỉ muốn xem theo năm
    private int month;

    // Năm muốn xem (ví dụ: 2025)
    private int year;
}
