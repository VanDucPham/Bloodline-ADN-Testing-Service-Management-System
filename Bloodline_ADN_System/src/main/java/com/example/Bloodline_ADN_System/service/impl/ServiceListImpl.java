package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.Service;
import com.example.Bloodline_ADN_System.dto.ManagerService.ServiceManagerDTO;
import com.example.Bloodline_ADN_System.dto.noneWhere.ServiceDTO;
import com.example.Bloodline_ADN_System.repository.ServiceRepository;
import com.example.Bloodline_ADN_System.service.ServiceList;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class ServiceListImpl implements ServiceList {

    private final ServiceRepository serviceRepository;

    public ServiceListImpl(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<ServiceManagerDTO> getAllServices() {
        return serviceRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ServiceManagerDTO getServiceById(Long id) {
        return toDTO(serviceRepository.findById(id).orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại")));
    }

    public ServiceManagerDTO createService(ServiceManagerDTO dto) {
        Service service = new Service();
        service.setServiceDescription(dto.getServiceDescription());
        service.setServiceName(dto.getServiceName());
        service.setServicePrice(dto.getServicePrice());
        service.setImageUrl(dto.getImageUrl());
        service.setLimitPeople(dto.getLimitPeople());
        return toDTO(serviceRepository.save(service));
    }

    public ServiceManagerDTO updateService(Long id, ServiceManagerDTO updateDTO) {
        Service service = serviceRepository.findById(id).orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại"));
        service.setLimitPeople(updateDTO.getLimitPeople());
        service.setImageUrl(updateDTO.getImageUrl());
        service.setServiceName(updateDTO.getServiceName());
        service.setServiceDescription(updateDTO.getServiceDescription());
        service.setServicePrice(updateDTO.getServicePrice());
        return toDTO(serviceRepository.save(service));
    }

    public void deleteService(Long id) {
        serviceRepository.findById(id).orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại"));
        serviceRepository.deleteById(id);
    }

    // Mapping methods
    public ServiceManagerDTO toDTO(Service service) {
        return new ServiceManagerDTO(
                service.getServiceId(),
                service.getServiceName(),
                service.getServiceDescription(),
                service.getLimitPeople(),
                service.getServicePrice(),
                service.getImageUrl()
        );
    }
    public Service toEntity(ServiceDTO dto) {

        Double price = dto.getServicePrice();
        if (price == null) {
            throw new IllegalArgumentException("Giá dịch vụ không được để trống");
        }
        if (price <= 0) {
            throw new IllegalArgumentException("Giá dịch vụ lớn hơn 0");
        }

        boolean nameExists = serviceRepository.existsByServiceName(dto.getServiceName());
        if (nameExists) {
            throw new IllegalArgumentException("Tên dịch vụ đã tồn tại");
        }
        Service service = new Service();
        service.setServiceName(dto.getServiceName());
        service.setServiceDescription(dto.getServiceDescription());
        service.setServicePrice(price);

        return service;
    }
}