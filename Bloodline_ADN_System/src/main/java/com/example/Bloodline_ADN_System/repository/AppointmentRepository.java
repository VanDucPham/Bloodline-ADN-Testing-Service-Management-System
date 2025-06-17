package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.dto.AppointmentDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserUserId(Long userId);

    //Đếm số lượng lịch theo ngày giờ
    int countByAppointmentDateAndAppointmentTime(LocalDate date, LocalTime time);

}
