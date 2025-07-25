package com.example.Bloodline_ADN_System.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaseTrackingDTO {
    private String caseId;
    private String appointmentId; // Thêm mã lịch hẹn
    private String customer;
    private String type;
    private LocalDate createdAt;
    private String status;
    private String staff;
    private String serviceName; // Tên dịch vụ
    private LocalDate appointmentDate; // Ngày hẹn
    private LocalTime appointmentTime; // Giờ hẹn
    private PaymentDTO paymentDTO; // Thông tin thanh toán
    private List<TimelineStep> timeline;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimelineStep {
        private String title;
        private String date; // YYYY-MM-DD string format
    }
}
