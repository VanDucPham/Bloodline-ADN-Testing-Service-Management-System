package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.ServiceDTO;
import com.example.Bloodline_ADN_System.service.ServiceList;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service")
public class ServiceListController {

    private final ServiceList serviceList;

    public ServiceListController(ServiceList serviceList) {
        this.serviceList = serviceList;
    }

    @GetMapping
    public List<ServiceDTO> getAllService() {
        return serviceList.getAllServices();
    }

    @GetMapping("/{id}")
    public ServiceDTO getServiceById(@PathVariable Long id) {
        return serviceList.getServiceById(id);
    }

    @PostMapping
    public ServiceDTO createService(@RequestBody ServiceDTO dto) {
        return serviceList.createService(dto);
    }

    @PutMapping("/{id}")
    public ServiceDTO updateService(@PathVariable Long id, @RequestBody ServiceDTO dto) {
        return serviceList.updateService(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteService(@PathVariable Long id) {
        serviceList.deleteService(id);
    }
}