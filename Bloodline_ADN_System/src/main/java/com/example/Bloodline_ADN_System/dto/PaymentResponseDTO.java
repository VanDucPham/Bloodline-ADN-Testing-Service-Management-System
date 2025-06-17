package com.example.Bloodline_ADN_System.dto;

import com.example.Bloodline_ADN_System.Entity.Payment.PaymentMethod;
import com.example.Bloodline_ADN_System.Entity.Payment.PaymentStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentResponseDTO {
    private Long paymentId;
    private Long appointmentId;
    private Double amount;
    private LocalDateTime paymentDate;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String notes;
}
