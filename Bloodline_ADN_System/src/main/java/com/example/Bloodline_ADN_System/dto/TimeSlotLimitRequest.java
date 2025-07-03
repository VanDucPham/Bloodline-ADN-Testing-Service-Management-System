package com.example.Bloodline_ADN_System.dto;

import lombok.Data;

@Data
public class TimeSlotLimitRequest {
    private String oldStartTime; // Thời gian bắt đầu cũ
    private String oldEndTime;   // Thời gian kết thúc cũ
    private String startTime;    // Thời gian bắt đầu mới
    private String endTime;      // Thời gian kết thúc mới
    private int maxAppointments;
}
