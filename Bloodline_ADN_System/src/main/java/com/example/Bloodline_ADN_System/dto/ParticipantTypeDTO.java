package com.example.Bloodline_ADN_System.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ParticipantTypeDTO {
    private Integer id;
    private String participantType;
    
    // Constructor for mapping from ParticipantType entity
    public ParticipantTypeDTO(Integer participantId, String participantName) {
        this.id = participantId;
        this.participantType = participantName;
    }
}
