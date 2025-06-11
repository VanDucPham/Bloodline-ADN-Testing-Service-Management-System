package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByAppointment_User_Email(String email);
}
