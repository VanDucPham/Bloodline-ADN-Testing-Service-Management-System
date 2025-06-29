package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.Entity.Appointment;

import com.example.Bloodline_ADN_System.dto.AppointmentCheckRequest;
import com.example.Bloodline_ADN_System.dto.ServiceDTO;

import com.example.Bloodline_ADN_System.dto.managerCaseFile.AppointmentDTO;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.AppointmentRequest;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.AppointmentResponse;
import com.example.Bloodline_ADN_System.service.AppointmentService;
import com.example.Bloodline_ADN_System.service.impl.ServiceImpl;
import com.example.Bloodline_ADN_System.service.impl.Time_slot_limit_Impl;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final Time_slot_limit_Impl timeSlotLimitService;
    private final ServiceImpl serviceImpl;

    public AppointmentController(AppointmentService appointmentService, Time_slot_limit_Impl timeSlotLimitService, ServiceImpl serviceImpl) {
        this.appointmentService = appointmentService;
        this.timeSlotLimitService = timeSlotLimitService;
        this.serviceImpl = serviceImpl;
    }


    @PostMapping()
    public ResponseEntity<AppointmentResponse<AppointmentDTO>> createAppointment(@RequestBody AppointmentDTO dto) {
        AppointmentResponse<AppointmentDTO> response = appointmentService.createAppointmentByStaff(dto);
        return ResponseEntity.ok(response);

    /**
     * Kiểm tra lịch trống dựa trên ngày giờ và email người dùng
     */
    @PostMapping("/check-availability")
    public ResponseEntity<String> checkAvailability(@RequestBody AppointmentCheckRequest request,
                                                    Authentication authentication) {
        String email = authentication.getName();

        boolean available = appointmentService.checkAvailability(
                request.getAppointmentDate(),
                request.getAppointmentTime(),
                email
        );

        return ResponseEntity.ok(available ? "Lịch trống." : "Lịch không trống.");

    }

    /**
     * Tạo mới một lịch hẹn
     */
    @PostMapping("/create")
    public ResponseEntity<AppointmentResponse<AppointmentDTO>> createAppointment(@RequestBody AppointmentRequest request) {
        AppointmentResponse<AppointmentDTO> response = appointmentService.createAppointment(request);
        return ResponseEntity.status(201).body(response);
    }

    /**
     * Lấy tất cả lịch hẹn (admin hoặc nhân viên)
     */
    @GetMapping("/all")
    public ResponseEntity<List<AppointmentDTO>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointment());
    }

    /**
     * Lấy lịch hẹn theo ID người dùng
     */
    @GetMapping("/{id}")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentByUserId(id));
    }

    /**
     * Hủy lịch hẹn
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<String> cancelAppointment(@PathVariable Long id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.ok("Hủy lịch hẹn thành công.");
    }

    /**
     * Lọc lịch hẹn theo trạng thái, loại và ngày
     */
    @GetMapping
    public ResponseEntity<List<AppointmentDTO>> filterAppointments(
            @RequestParam(required = false) Appointment.AppointmentStatus status,
            @RequestParam(required = false) Appointment.AppointmentType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.filterAppointment(status, type, date));
    }

    /**
     * Cập nhật trạng thái lịch hẹn
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(@PathVariable Long id,
                                               @RequestParam Appointment.AppointmentStatus status) {
        appointmentService.updateAppointmentProgress(id, status);
        return ResponseEntity.ok("Cập nhật trạng thái thành công.");
    }

    /**
     * Lấy danh sách khung giờ hẹn
     */
    @GetMapping("/time-slots")
    public ResponseEntity<?> getAppointmentTimeSlots() {
        System.out.println("Đã gọi được slot");
        return ResponseEntity.ok(timeSlotLimitService.getTimeSlotLimit());
    }

    @GetMapping("/service")
    public ResponseEntity<List<ServiceDTO>> getAppointmentService() {
        return ResponseEntity.ok(serviceImpl.getAllServices());
    }

}
