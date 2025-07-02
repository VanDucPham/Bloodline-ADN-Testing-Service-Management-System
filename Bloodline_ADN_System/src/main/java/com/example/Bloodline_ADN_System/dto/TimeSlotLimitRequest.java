package com.example.Bloodline_ADN_System.dto;

import lombok.Data;


@Data
public class TimeSlotLimitRequest {
    private String startTime;      // "HH:mm"
    private String endTime;        // "HH:mm"
    private int maxAppointments;
}
