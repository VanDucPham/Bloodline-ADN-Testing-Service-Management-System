package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByAppointment_AppointmentId(Long appointmentId);
}
