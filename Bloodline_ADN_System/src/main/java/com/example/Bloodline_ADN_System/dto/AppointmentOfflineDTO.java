package com.example.Bloodline_ADN_System.dto;


import com.example.Bloodline_ADN_System.Entity.Appointment;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentOfflineDTO {
    private Long serviceId;
    private Appointment.AppointmentType appointmentType;   // ADMINISTRATIVE hoặc CIVIL
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private Appointment.DeliveryMethod deliveryMethod;    // HOME_COLLECTION hoặc SELF_DROP_OFF
    private String appointmentNote;
}
