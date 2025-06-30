package com.example.Bloodline_ADN_System.dto.managerCaseFile;



import com.example.Bloodline_ADN_System.Entity.Participant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantDTO {
    private Long participantId;
    private Long appointmentId;
    private String name;
    private String relationship;
    private String citizenId;
    private String address;
    private LocalDate birthDate;
    private String gender;

    public ParticipantDTO(Long participantId, String name, String relationship, String citizenId, String address, LocalDate birthDate, Participant.Gender gender) {
    }
}
