package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.dto.ParticipantDTO;

import java.util.List;

public interface ParticipantService {
    List<ParticipantDTO> addParticipant(List<ParticipantDTO> participantDTOList);
}