package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.Entity.Appointment.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    // Lấy danh sách cuộc hẹn theo trạng thái
    List<Appointment> findByStatus(AppointmentStatus status);
}