package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.dto.AppointmentDTO;
import com.example.Bloodline_ADN_System.dto.AppointmentResponse;
import com.example.Bloodline_ADN_System.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/appointment")
    public ResponseEntity<AppointmentResponse<AppointmentDTO>> createAppointment(@RequestBody AppointmentDTO dto) {
        AppointmentResponse<AppointmentDTO> response = appointmentService.createAppointment(dto);
        return ResponseEntity.ok(response);
    }
}
