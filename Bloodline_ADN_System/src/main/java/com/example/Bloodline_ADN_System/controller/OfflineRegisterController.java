package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.OfflineRegisterRequestDTO;
import com.example.Bloodline_ADN_System.service.OfflineRegisterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class OfflineRegisterController {

    private final OfflineRegisterService offlineRegisterService;

    @PostMapping("/offline-register")
    public ResponseEntity<String> registerCustomerOffline(@RequestBody OfflineRegisterRequestDTO dto) {
        try {
            offlineRegisterService.createOfflineRegister(dto);
            return ResponseEntity.ok("Tạo hồ sơ khách hàng tại cơ sở thành công.");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body("Lỗi: " + ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body("Lỗi hệ thống: " + ex.getMessage());
        }
    }
}
