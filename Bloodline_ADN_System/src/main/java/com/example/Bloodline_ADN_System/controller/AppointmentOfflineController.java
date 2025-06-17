package com.example.Bloodline_ADN_System.controller;


import com.example.Bloodline_ADN_System.dto.AppointmentOfflineDTO;
import com.example.Bloodline_ADN_System.dto.AppointmentOfflineResponse;
import com.example.Bloodline_ADN_System.service.AppointmentOfflineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
public class AppointmentOfflineController {

    private final AppointmentOfflineService appointmentOfflineService;

    public AppointmentOfflineController(AppointmentOfflineService appointmentOfflineService) {
        this.appointmentOfflineService = appointmentOfflineService;
    }

    @PostMapping("/appointment-offline")
    public ResponseEntity<AppointmentOfflineResponse<AppointmentOfflineDTO>> createAppointment(@RequestBody AppointmentOfflineDTO dto) {
        AppointmentOfflineResponse<AppointmentOfflineDTO> response = appointmentOfflineService.createAppointmentOffline(dto);
        return ResponseEntity.ok(response);
    }
}
