package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.dto.AppointmentDTO;
import com.example.Bloodline_ADN_System.dto.AppointmentResponse;
import com.example.Bloodline_ADN_System.dto.ParticipantDTO;
import com.example.Bloodline_ADN_System.service.AppointmentService;
import com.example.Bloodline_ADN_System.service.ParticipantService;
import com.example.Bloodline_ADN_System.service.SampleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final ParticipantService participantService;
    private final SampleService sampleService;


    public AppointmentController(AppointmentService appointmentService, ParticipantService participantService, SampleService sampleService) {
        this.appointmentService = appointmentService;
        this.participantService = participantService;
        this.sampleService = sampleService;
    }

    @PostMapping("/appointment")
    public ResponseEntity<AppointmentResponse<AppointmentDTO>> createAppointment(@RequestBody AppointmentDTO dto) {
        AppointmentResponse<AppointmentDTO> response = appointmentService.createAppointment(dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("participants")
    public ResponseEntity<List<ParticipantDTO>> addParticipants(@RequestBody List<ParticipantDTO> participantDTOs) {
        List<ParticipantDTO> savedParticipants = participantService.addParticipant(participantDTOs);
        return ResponseEntity.ok(savedParticipants);
    }
}
