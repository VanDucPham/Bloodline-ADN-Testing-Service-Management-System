package com.example.Bloodline_ADN_System.dto;

import lombok.*;
import java.time.LocalDateTime;

// DTO trả về thông tin thanh toán đã hoàn tất
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDTO {

    // Mã giao dịch thanh toán
    private Long paymentId;

    // Tên khách hàng đã thanh toán
    private String customerName;

    // Số tiền thanh toán
    private Double amount;

    // Phương thức thanh toán: CREDIT_CARD, CASH, v.v.
    private String method;

    // Ngày giờ thanh toán
    private LocalDateTime paymentDate;

    // Ghi chú thêm (nếu có)
    private String notes;
}
