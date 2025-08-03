package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.Service;
import com.example.Bloodline_ADN_System.dto.ParticipantTypeDTO;
import com.example.Bloodline_ADN_System.dto.noneWhere.ServiceDTO;
import com.example.Bloodline_ADN_System.repository.ServiceRepository;
import com.example.Bloodline_ADN_System.service.ServiceService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
                .map(serviceEntity -> {
                    // Debug logging
                    System.out.println("Service: " + serviceEntity.getServiceName());
                    System.out.println("ParticipantTypes count: " + serviceEntity.getParticipantType().size());
                    
                    // Map participantTypes to ParticipantTypeDTO
                    List<ParticipantTypeDTO> participantTypeDTOs = serviceEntity.getParticipantType()
                            .stream()
                            .map(pt -> {
                                System.out.println("ParticipantType: " + pt.getParticipantName());
                                return new ParticipantTypeDTO(pt.getParticipantId(), pt.getParticipantName());
                            })
                            .collect(Collectors.toList());
                    
                    System.out.println("Mapped DTOs count: " + participantTypeDTOs.size());
                    
                    return new ServiceDTO(
                            serviceEntity.getServiceName(),
                            serviceEntity.getLimitPeople(),
                            serviceEntity.getServiceDescription(),
                            serviceEntity.getServiceId(),
                            serviceEntity.getServicePrice(),
                            serviceEntity.getImageUrl(),
                            participantTypeDTOs
                    );
                })
                .toList();
    }

    @Override
    public Optional<Service> findServiceById(Long ServiceId) {
        return  serviceRepository.findById(ServiceId);
    }

    @Override
    public ServiceDTO getServiceById(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        
        // Debug logging
        System.out.println("Service by ID: " + service.getServiceName());
        System.out.println("ParticipantTypes count: " + service.getParticipantType().size());
        
        // Map participantTypes to ParticipantTypeDTO
        List<ParticipantTypeDTO> participantTypeDTOs = service.getParticipantType()
                .stream()
                .map(pt -> {
                    System.out.println("ParticipantType: " + pt.getParticipantName());
                    return new ParticipantTypeDTO(pt.getParticipantId(), pt.getParticipantName());
                })
                .collect(Collectors.toList());
        
        ServiceDTO dt = new ServiceDTO();
        dt.setServiceName(service.getServiceName());
        dt.setServiceDescription(service.getServiceDescription());
        dt.setServicePrice(service.getServicePrice());
        dt.setServiceId(service.getServiceId());
        dt.setLimit_people(service.getLimitPeople());
        dt.setImageUrl(service.getImageUrl());
        dt.setParticipantsType(participantTypeDTOs);

        return dt;
    }

}
