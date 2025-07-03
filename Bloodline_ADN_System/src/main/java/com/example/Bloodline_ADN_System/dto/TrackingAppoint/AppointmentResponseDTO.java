package com.example.Bloodline_ADN_System.dto.TrackingAppoint;

import com.example.Bloodline_ADN_System.Entity.Payment;
import com.example.Bloodline_ADN_System.dto.ParticipantResponeDTO;
import com.example.Bloodline_ADN_System.dto.SampleDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentResponseDTO {
    private String appointmentId;
    private String CaseCode ;
    private String ServiceName ;
    private String CaseType ;
    private LocalDate Date ;
    private LocalTime Time ;
    private String StatusAppointment ;
    List<ParticipantResponeDTO> participantResponseDTOS ;
    Payment Payment ;


}
