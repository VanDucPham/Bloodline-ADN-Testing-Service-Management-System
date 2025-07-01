package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    boolean existsByServiceName(String name);
}
