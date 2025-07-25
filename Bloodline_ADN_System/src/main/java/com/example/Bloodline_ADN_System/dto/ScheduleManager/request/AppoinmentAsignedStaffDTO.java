package com.example.Bloodline_ADN_System.dto.ScheduleManager.request;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import lombok.Data;

@Data
public class AppoinmentAsignedStaffDTO {
    private Long appointmentId;
    private String collectionStatus;
    private String staffCode;
}
