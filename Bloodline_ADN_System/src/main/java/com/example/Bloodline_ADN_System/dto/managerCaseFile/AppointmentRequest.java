package com.example.Bloodline_ADN_System.dto.managerCaseFile;

import com.example.Bloodline_ADN_System.dto.noneWhere.SampleDTO;
import lombok.Data;

import java.util.List;
@Data
public class AppointmentRequest {
    private AppointmentDTO appointment;
    private List<ParticipantDTO> participants;
    private List<SampleDTO> samples;
    private caseFileDTO caseFile;
}
