package com.example.Bloodline_ADN_System.dto.managerCaseFile;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.Entity.CaseFile;
import com.example.Bloodline_ADN_System.Entity.Participant;
import com.example.Bloodline_ADN_System.Entity.Sample;
import com.example.Bloodline_ADN_System.dto.SampleDTO;
import lombok.Data;

import java.util.List;
@Data
public class AppointmentRequest {
    private AppointmentDTO appointment;
    private List<ParticipantDTO> participants;
    private List<SampleDTO> samples;
    private caseFileDTO caseFile;
}
