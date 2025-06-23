package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.managerCaseFile.AppointmentDTO;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.AppointmentResponse;
import com.example.Bloodline_ADN_System.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/appointment")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping()
    public ResponseEntity<AppointmentResponse<AppointmentDTO>> createAppointment(@RequestBody AppointmentDTO dto) {
        AppointmentResponse<AppointmentDTO> response = appointmentService.createAppointment(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public List<AppointmentDTO> getAllAppointment() {
        List<AppointmentDTO> response = appointmentService.getAllAppointment();
        return response;
    }

    @GetMapping("/{id}")
    public List<AppointmentDTO> getAppointmentByUserId(@PathVariable Long id) {
        List<AppointmentDTO> response = appointmentService.getAppointmentByUserId(id);
        return response;
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.ok("Hủy lịch hẹn thành công.");
    }
}
