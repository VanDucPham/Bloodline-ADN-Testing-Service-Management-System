package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Optional<Feedback> findByAppointment_AppointmentId(Long appointmentId);

}
