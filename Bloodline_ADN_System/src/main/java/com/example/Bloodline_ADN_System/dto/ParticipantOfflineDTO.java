package com.example.Bloodline_ADN_System.dto;


import com.example.Bloodline_ADN_System.Entity.Participant;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ParticipantOfflineDTO {
    private String name;
    private String relationship;
    private Participant.Gender gender;
    private String citizenId;
    private String address;
    private LocalDate birthDate;
    private Long appointmentId;  // để liên kết với appointment đã có
}
