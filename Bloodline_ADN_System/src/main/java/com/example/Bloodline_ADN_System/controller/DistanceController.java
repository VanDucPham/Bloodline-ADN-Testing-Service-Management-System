package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.service.DistanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/distance")
public class DistanceController {
    @Autowired
    private DistanceService distanceService;

    // API: /api/distance/to-customer?customerAddress=...
    @GetMapping("/to-customer")
    public ResponseEntity<?> getDistanceToCustomer(@RequestParam String customerAddress) {
        if (customerAddress == null || customerAddress.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Địa chỉ khách hàng không được để trống");
        }
        boolean isValid = distanceService.isValidDistance(customerAddress);
        if (!isValid) {
            return ResponseEntity.badRequest().body("Khoảng cách không hợp lệ, yêu cầu nhập lại");
        }
        // Có thể trả về true hoặc 1 để FE nhận biết hợp lệ
        return ResponseEntity.ok(true);
    }
} 