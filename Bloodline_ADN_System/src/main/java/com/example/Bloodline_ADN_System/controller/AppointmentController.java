package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.dto.AppointmentDTO;
import com.example.Bloodline_ADN_System.dto.AppointmentResponse;
import com.example.Bloodline_ADN_System.service.AppointmentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointment")
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

    @GetMapping("/all")
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

    @GetMapping
    public ResponseEntity<List<AppointmentDTO>> filterAppointments(
            @RequestParam(required = false) Appointment.AppointmentStatus status,
            @RequestParam(required = false) Appointment.AppointmentType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<AppointmentDTO> appointments = appointmentService.filterAppointment(status, type, date);
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestParam Appointment.AppointmentStatus status) {
            appointmentService.updateAppointmentProgress(id, status);
            return ResponseEntity.ok("Cập nhật trạng thái thành công.");
    }
}
