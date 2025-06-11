package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ServiceRepository extends JpaRepository<Service, Long> {

}
