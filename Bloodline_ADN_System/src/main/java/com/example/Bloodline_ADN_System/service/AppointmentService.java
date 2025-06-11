package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.dto.AppointmentDTO;
import com.example.Bloodline_ADN_System.dto.AppointmentResponse;

public interface AppointmentService {
    AppointmentResponse<AppointmentDTO> createAppointment(AppointmentDTO dto);
}
