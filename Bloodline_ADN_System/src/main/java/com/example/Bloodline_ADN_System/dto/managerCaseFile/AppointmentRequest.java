package com.example.Bloodline_ADN_System.dto.managerCaseFile;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.Entity.CaseFile;
import com.example.Bloodline_ADN_System.Entity.Participant;
import com.example.Bloodline_ADN_System.Entity.Sample;
import lombok.Data;

import java.util.List;
@Data
public class AppointmentRequest {
    private Appointment appointment;
    private List<Participant> participants;
    private List<Sample> samples;
    private CaseFile caseFile;
}
