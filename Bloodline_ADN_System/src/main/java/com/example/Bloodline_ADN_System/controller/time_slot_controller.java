package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.TimeSlotLimitRequest;
import com.example.Bloodline_ADN_System.dto.TimeSlotLimitResponse;
import com.example.Bloodline_ADN_System.service.Time_slot_limit_Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("api/admin/time-slot")
public class time_slot_controller {

    @Autowired
    private Time_slot_limit_Service service;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody TimeSlotLimitRequest request) {
        try {
            TimeSlotLimitResponse response = service.create(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Tạo khung giờ thành công", "data", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi hệ thống: " + e.getMessage()));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody TimeSlotLimitRequest request) {
        try {
            TimeSlotLimitResponse response = service.update(request);
            return ResponseEntity.ok(Map.of("message", "Cập nhật thành công", "data", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi hệ thống: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestParam String startTime, @RequestParam String endTime) {
        try {
            service.delete(startTime, endTime);
            return ResponseEntity.ok(Map.of("message", "Xóa khung giờ thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/get")
    public ResponseEntity<?> get(@RequestParam String startTime, @RequestParam String endTime) {
        try {
            TimeSlotLimitResponse response = service.get(startTime, endTime);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Không tìm thấy kết quả"));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        List<TimeSlotLimitResponse> list = service.getAll();
        if (list.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Không có khung giờ nào."));
        }
        return ResponseEntity.ok(list);
    }
}
