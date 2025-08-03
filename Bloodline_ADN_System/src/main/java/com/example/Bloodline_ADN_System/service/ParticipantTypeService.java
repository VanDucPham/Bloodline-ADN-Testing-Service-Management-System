package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.Entity.ParticipantType;
import com.example.Bloodline_ADN_System.dto.ParticipantTypeDTO;

import java.util.List;

public interface ParticipantTypeService {
    public ParticipantType createParticipantType(ParticipantTypeDTO participantTypeDTO);
    public List<ParticipantTypeDTO> getAllParticipantTypes();
    public void deleteParticipantType(Long id);

}
