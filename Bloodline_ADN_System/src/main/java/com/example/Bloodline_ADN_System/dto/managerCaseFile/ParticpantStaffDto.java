package com.example.Bloodline_ADN_System.dto.managerCaseFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticpantStaffDto {
    private Long participantId;
    private Long appointmentId;
    private String name;
    private String relationship;
    private String citizenId;
    private String address;
    private LocalDate birthDate;
    private String gender;
}
