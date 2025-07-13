package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.noneWhere.ServiceDTO;
import com.example.Bloodline_ADN_System.service.ServiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/service") // URL chính của API
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    // API lấy tất cả dịch vụ (yêu cầu authentication)
    @GetMapping
    public ResponseEntity<List<ServiceDTO>> getAllServices() {
        List<ServiceDTO> services = serviceService.getAllServices();
        System.out.println(services.size());
        return ResponseEntity.ok(services); // Trả về 200 OK và list dịch vụ
    }

    // API public để lấy danh sách dịch vụ (không cần authentication)
    @GetMapping("/public")
    public ResponseEntity<List<ServiceDTO>> getPublicServices() {
        List<ServiceDTO> services = serviceService.getAllServices();
        return ResponseEntity.ok(services);
    }

    // API public lấy chi tiết dịch vụ theo id
    @GetMapping("/public/{id}")
    public ResponseEntity<ServiceDTO> getPublicServiceById(@PathVariable Long id) {
        ServiceDTO service = serviceService.getServiceById(id);
        return ResponseEntity.ok(service);
    }
}
