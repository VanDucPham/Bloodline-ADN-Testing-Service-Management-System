package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.AppointmentDTO;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.AppointmentRequest;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.AppointmentResponse;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;

import java.time.LocalTime;
import java.util.List;




import java.time.LocalTime;
import java.util.List;

public interface AppointmentService {

    AppointmentResponse<AppointmentDTO> createAppointmentByStaff(AppointmentDTO dto);
    @Transactional
    AppointmentResponse<AppointmentDTO> createAppointment(AppointmentRequest request);


    List<AppointmentDTO> getAllAppointment();
    List<AppointmentDTO> getAppointmentByUserId(Long userId);
    void cancelAppointment(Long id);
    List<AppointmentDTO> filterAppointment(Appointment.AppointmentStatus status, Appointment.AppointmentType type, LocalDate date);
    AppointmentDTO updateAppointmentProgress(Long id, Appointment.AppointmentStatus status);


  //  Long getUserIdByUsername(String username);



        boolean checkAvailability(LocalDate date, LocalTime time, String email);
        Long getUserIdByUsername(String username);
        boolean isUserIdExist(Long userId);




    void updateAppointment(AppointmentDTO appointmentDTO, Long appointmentId);
}

