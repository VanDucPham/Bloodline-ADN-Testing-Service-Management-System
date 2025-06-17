package com.example.Bloodline_ADN_System.controller;


import com.example.Bloodline_ADN_System.dto.ParticipantOfflineDTO;
import com.example.Bloodline_ADN_System.service.ParticipantOfflineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/participants")
public class ParticipantOfflineController {

    private final ParticipantOfflineService participantOfflineService;

    public ParticipantOfflineController(ParticipantOfflineService participantOfflineService) {
        this.participantOfflineService = participantOfflineService;
    }


    @PostMapping
    public ResponseEntity<List<ParticipantOfflineDTO>> addParticipantsOffline(@RequestBody List<ParticipantOfflineDTO> participantOfflineDTOs) {
        List<ParticipantOfflineDTO> savedParticipants = participantOfflineService.addParticipantOffline(participantOfflineDTOs);
        return ResponseEntity.ok(savedParticipants);
    }
}
