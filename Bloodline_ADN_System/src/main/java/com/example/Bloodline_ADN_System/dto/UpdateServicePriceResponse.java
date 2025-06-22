package com.example.Bloodline_ADN_System.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateServicePriceResponse {
    private Long serviceId;     // ID dịch vụ vừa cập nhật
    private String message;     // Thông báo kết quả
}
