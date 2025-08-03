package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.ParticipantType;
import com.example.Bloodline_ADN_System.dto.ParticipantTypeDTO;
import com.example.Bloodline_ADN_System.repository.ParticipantTypeRepository;
import com.example.Bloodline_ADN_System.service.ParticipantTypeService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ParticipantTypeImp implements ParticipantTypeService {
    @Autowired
    private ParticipantTypeRepository participantTypeRepository;

    @Override
    public ParticipantType createParticipantType(ParticipantTypeDTO dto) {
        ParticipantType participantType = new ParticipantType();
        participantType.setParticipantName(dto.getParticipantType());
        return participantTypeRepository.save(participantType);
    }

    @Override
    public List<ParticipantTypeDTO> getAllParticipantTypes() {
        return participantTypeRepository.findAll().stream().map(dt -> new ParticipantTypeDTO(dt.getParticipantId(), dt.getParticipantName()) ).collect(Collectors.toList());
    }
    @Override
    @Transactional
    public void deleteParticipantType(Long id) {
        ParticipantType participantType = participantTypeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Loại người tham gia không tồn tại"));

        if (!participantType.getServices().isEmpty()) {
            throw new IllegalStateException("Không thể xoá. Loại này đang được sử dụng trong dịch vụ.");
        }

        participantTypeRepository.delete(participantType);
    }

}
