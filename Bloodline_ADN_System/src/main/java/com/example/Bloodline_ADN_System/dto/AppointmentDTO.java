package com.example.Bloodline_ADN_System.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
public class AppointmentDTO {
    private Long appointmentId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String appointmentNote;
    private String status;
    private String serviceName;
    private String resultSummary;

    private List<ParticipantDTO> participants;

    // 🔽 Thông tin thanh toán mở rộng
    private String paymentStatus;
    private String paymentMethod;
    private Double amount;
    private LocalDateTime paymentDate;
    private String paymentNote;
}
