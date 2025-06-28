package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.dto.ServiceDTO;

import java.util.List;

public interface ServiceList {
    List<ServiceDTO> getAllServices();
    ServiceDTO getServiceById(Long id);
    ServiceDTO createService(ServiceDTO dto);
    ServiceDTO updateService(Long id, ServiceDTO dto);
    void deleteService(Long id);
}