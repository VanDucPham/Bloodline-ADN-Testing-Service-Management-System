package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.Service;
import com.example.Bloodline_ADN_System.dto.ServiceDTO;
import com.example.Bloodline_ADN_System.repository.ServiceRepository;
import com.example.Bloodline_ADN_System.service.ServiceService;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
public class ServiceImpl implements ServiceService {
    private final ServiceRepository serviceRepository;

    public ServiceImpl(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @Override
    public List<ServiceDTO> getAllServices() {
        return serviceRepository.findAll()
                .stream()
                .map(serviceEntity -> new ServiceDTO(
                        serviceEntity.getServiceName(),
                        serviceEntity.getServiceDescription(),
                        serviceEntity.getServiceId(),
                        serviceEntity.getServicePrice()
                ))
                .toList();
    }

    @Override
    public Optional<Service> findServiceById(Long ServiceId) {

        return  serviceRepository.findById(ServiceId);
    }

}
