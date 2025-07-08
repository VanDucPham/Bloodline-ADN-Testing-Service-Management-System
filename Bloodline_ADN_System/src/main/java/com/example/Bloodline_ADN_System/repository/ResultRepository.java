package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResultRepository  extends JpaRepository<Result, Long> {
    Optional<Result> findByAppointment_AppointmentId(Long appointmentId);

}
