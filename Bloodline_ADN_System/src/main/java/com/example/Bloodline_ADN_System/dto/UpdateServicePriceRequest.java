package com.example.Bloodline_ADN_System.dto;

import lombok.Data;

@Data
public class UpdateServicePriceRequest {
    private Long serviceId;     // ID dịch vụ cần cập nhật
    private Double newPrice;    // Giá mới
}
