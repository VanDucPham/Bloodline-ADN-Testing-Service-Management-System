package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.ParticipantType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipantTypeRepository extends JpaRepository<ParticipantType, Long> {
    ParticipantType findByParticipantName(String participantName);
    List<ParticipantType> findByParticipantNameIn(List<String> participantNames);
}
