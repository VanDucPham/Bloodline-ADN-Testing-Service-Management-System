package com.example.Bloodline_ADN_System.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ParticipantDTO {
    private String name;
    private String relationship;
    private String citizenId;
    private String gender;
    private LocalDate birthDate;
    private String address;
    private String sampleStatus; // Trạng thái mẫu xét nghiệm (COLLECTED, ANALYZED, ...)
}
