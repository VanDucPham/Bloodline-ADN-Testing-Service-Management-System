package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.dto.*;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.AppointmentDTO;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.AppointmentResponse;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.ParticipantDTO;
import com.example.Bloodline_ADN_System.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/staff")
public class StaffCaseFileController {
    private final AppointmentService appointmentService;
    private final SampleService sampleService;
    private final ParticipantService participantService;
    private final ServiceList serviceList;
    private final UserService userService;

    @GetMapping("/appointment")
    public ResponseEntity<List<AppointmentDTO>> filterAppointments(
            @RequestParam(required = false) Appointment.AppointmentStatus status,
            @RequestParam(required = false) Appointment.AppointmentType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<AppointmentDTO> appointments = appointmentService.filterAppointment(status, type, date);
        return ResponseEntity.ok(appointments);
    }

    @PostMapping("/sample/offline")
    public ResponseEntity<List<SampleDTO>> createSample(@RequestBody List<SampleStaffDTO> dtoList) {
        return ResponseEntity.ok(sampleService.createSampleByStaff(dtoList));
    }

    @PutMapping("/sample/update")
    public ResponseEntity<SampleDTO> updateSample(@RequestBody SampleUpdateDTO dto){
        return ResponseEntity.ok(sampleService.updateSampleInfo(dto));
    }

    @GetMapping("/participant/{id}")
    public ResponseEntity<List<ParticipantResponeDTO>> getParticipantsByAppointment(@PathVariable("id") Long id) {
        List<ParticipantResponeDTO> list = participantService.getParticipantByAppointmentId(id);
        return ResponseEntity.ok(list);
    }

    @PutMapping("/apointment/update/{id}")
    public ResponseEntity<AppointmentDTO> updateAppointment(@PathVariable Long id, @RequestParam("status") Appointment.AppointmentStatus status
    ) {
        return ResponseEntity.ok(appointmentService.updateAppointmentProgress(id, status));
    }

    @GetMapping("/sample/get/{id}")
    public ResponseEntity<SampleDTO> getSampleByParticipant(@PathVariable Long id){
        SampleDTO sample = sampleService.getSampleByParticipantId(id);
        return ResponseEntity.ok(sample);
    }

    @PostMapping("/appointment/create")
    public ResponseEntity<AppointmentResponse<AppointmentDTO>> createAppointment(@RequestBody AppointmentDTO dto) {
        AppointmentResponse<AppointmentDTO> response = appointmentService.createAppointment(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/services")
    public List<ServiceDTO> getAllService() {
        return serviceList.getAllServices();
    }

    @GetMapping ("/profile")
    public ResponseEntity<UserUpdateDTO> getProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @PostMapping("/participant/create")
    public ResponseEntity<List<ParticipantDTO>> addParticipants(@RequestBody List<ParticipantDTO> participantDTOs) {
        List<ParticipantDTO> savedParticipants = participantService.addParticipant(participantDTOs);
        return ResponseEntity.ok(savedParticipants);
    }

}
