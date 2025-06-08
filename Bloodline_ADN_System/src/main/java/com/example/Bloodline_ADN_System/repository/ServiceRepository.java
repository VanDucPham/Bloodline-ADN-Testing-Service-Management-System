package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    boolean existsByServiceName(String name);
}
