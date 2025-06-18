package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.dto.AppointmentDTO;
import com.example.Bloodline_ADN_System.dto.AppointmentResponse;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {
    AppointmentResponse<AppointmentDTO> createAppointment(AppointmentDTO dto);
    List<AppointmentDTO> getAllAppointment();
    List<AppointmentDTO> getAppointmentByUserId(Long userId);
    void cancelAppointment(Long id);
    List<AppointmentDTO> filterAppointment(Appointment.AppointmentStatus status, Appointment.AppointmentType type, LocalDate date);
    AppointmentDTO updateAppointmentProgress(Long id, Appointment.AppointmentStatus status);
}
