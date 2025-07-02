package com.example.Bloodline_ADN_System.dto;

import lombok.Data;



@Data
public class TimeSlotLimitResponse {
    private String startTime;
    private String endTime;
    private int maxAppointments;
}
