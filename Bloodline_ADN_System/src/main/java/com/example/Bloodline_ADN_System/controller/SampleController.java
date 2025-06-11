package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.Entity.Sample;
import com.example.Bloodline_ADN_System.service.SampleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff/samples")
@RequiredArgsConstructor
public class SampleController {

    private final SampleService sampleService;

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable("id") Long sampleId,
            @RequestParam("status") String statusString) {
        try {
            Sample.SampleStatus status = Sample.SampleStatus.valueOf(statusString.toUpperCase());
            sampleService.updateSampleStatus(sampleId, status);
            return ResponseEntity.ok("Cập nhật trạng thái mẫu thành công.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Trạng thái không hợp lệ hoặc không tìm thấy mẫu.");
        }
    }
}
