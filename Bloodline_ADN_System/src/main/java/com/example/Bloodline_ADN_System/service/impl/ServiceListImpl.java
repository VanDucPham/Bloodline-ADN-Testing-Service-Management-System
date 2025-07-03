package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.Service;
import com.example.Bloodline_ADN_System.dto.ServiceDTO;
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

    public List<ServiceDTO> getAllServices() {
        return serviceRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ServiceDTO getServiceById(Long id) {
        return toDTO(serviceRepository.findById(id).orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại")));
    }

    public ServiceDTO createService(ServiceDTO dto) {
        Service service = toEntity(dto);
        return toDTO(serviceRepository.save(service));
    }

    public ServiceDTO updateService(Long id, ServiceDTO updateDTO) {
        Service service = serviceRepository.findById(id).orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại"));
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
    public ServiceDTO toDTO(Service service) {
        return new ServiceDTO(
                service.getServiceId(),
                service.getServiceName(),
                service.getServiceDescription(),
                service.getServicePrice()
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