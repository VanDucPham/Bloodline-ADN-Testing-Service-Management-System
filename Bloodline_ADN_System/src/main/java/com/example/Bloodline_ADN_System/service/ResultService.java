package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.dto.ResultDTO;

public interface ResultService {
    ResultDTO getResultByAppointmentId(Long appointmentId);
    String validateAppointmentForResult(Long appointmentId);
    ResultDTO createResult(ResultDTO dto);
}
