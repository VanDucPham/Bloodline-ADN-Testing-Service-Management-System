package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD

import java.util.Optional;

public interface ResultRepository  extends JpaRepository<Result, Long> {
    Optional<Result> findByAppointment_AppointmentId(Long appointmentId);

}
=======
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    Optional<Result> findByAppointment_AppointmentId(Long appointmentId);
} 
>>>>>>> 616b0a89a72a70858c82b9a1709513e31559cb1a
