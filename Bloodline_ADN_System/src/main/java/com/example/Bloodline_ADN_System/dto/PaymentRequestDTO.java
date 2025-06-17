package com.example.Bloodline_ADN_System.dto;

import com.example.Bloodline_ADN_System.Entity.Payment.PaymentMethod;
import com.example.Bloodline_ADN_System.Entity.Payment.PaymentStatus;
import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
public class PaymentRequestDTO {

    @NotNull(message = "Appointment ID is required")
    private Long appointmentId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    // Trạng thái có thể không cần client truyền vào khi tạo, mặc định là PENDING
    private PaymentStatus status;

    private String notes;
}
