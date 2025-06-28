package com.example.Bloodline_ADN_System.dto;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentCheckRequest {
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
}
