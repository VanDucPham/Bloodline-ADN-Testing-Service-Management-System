package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.ServiceEntity;
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
        ServiceEntity serviceEntity = toEntity(dto);
        return toDTO(serviceRepository.save(serviceEntity));
    }

    public ServiceDTO updateService(Long id, ServiceDTO updateDTO) {
        ServiceEntity serviceEntity = serviceRepository.findById(id).orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại"));
        serviceEntity.setServiceName(updateDTO.getServiceName());
        serviceEntity.setServiceDescription(updateDTO.getServiceDescription());
        serviceEntity.setServicePrice(updateDTO.getServicePrice());
        return toDTO(serviceRepository.save(serviceEntity));
    }

    public void deleteService(Long id) {
        serviceRepository.findById(id).orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại"));
        serviceRepository.deleteById(id);
    }

    // Mapping methods
    public ServiceDTO toDTO(ServiceEntity serviceEntity) {
        return new ServiceDTO(
                serviceEntity.getServiceId(),
                serviceEntity.getServiceName(),
                serviceEntity.getServiceDescription(),
                serviceEntity.getServicePrice()
        );
    }
    public ServiceEntity toEntity(ServiceDTO dto) {

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
        ServiceEntity serviceEntity = new ServiceEntity();
        serviceEntity.setServiceName(dto.getServiceName());
        serviceEntity.setServiceDescription(dto.getServiceDescription());
        serviceEntity.setServicePrice(price);

        return serviceEntity;
    }
}