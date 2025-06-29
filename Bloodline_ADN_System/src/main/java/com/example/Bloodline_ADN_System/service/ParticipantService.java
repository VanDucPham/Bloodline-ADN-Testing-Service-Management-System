package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.dto.ParticipantResponeDTO;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.ParticipantDTO;

import java.util.List;

public interface ParticipantService {
    List<ParticipantDTO> addParticipant(List<ParticipantDTO> participantDTOList);
    List<ParticipantResponeDTO> getParticipantByAppointmentId(Long appointmentId);
}