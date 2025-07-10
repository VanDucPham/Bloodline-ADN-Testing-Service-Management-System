package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.FeedbackDTO;
import com.example.Bloodline_ADN_System.dto.FeedbackResponse;
import com.example.Bloodline_ADN_System.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {
    private final FeedbackService feedbackService;

    // Customer: Tạo feedback (chỉ Customer mới được gọi)
    @PostMapping("/create")
    public ResponseEntity<FeedbackResponse> create(@RequestBody FeedbackDTO feedbackDTO, Authentication authentication) {
        FeedbackResponse response = feedbackService.createFeedback(feedbackDTO, authentication.getName());
        return ResponseEntity.ok(response);
    }

    // Customer: Xem feedback của chính mình
    @GetMapping("/my-feedback")
    public ResponseEntity<List<FeedbackResponse>> getMyFeedback(Authentication authentication) {
        List<FeedbackResponse> responses = feedbackService.getFeedbackByUserEmail(authentication.getName());
        return ResponseEntity.ok(responses);
    }

    // Customer: Xem chi tiết feedback của mình
    @GetMapping("/my-feedback/{feedbackId}")
    public ResponseEntity<FeedbackResponse> getMyFeedbackById(@PathVariable Long feedbackId, Authentication authentication) {
        FeedbackResponse response = feedbackService.getFeedbackByIdForUser(feedbackId, authentication.getName());
        return ResponseEntity.ok(response);
    }

    // Admin/Manager/Staff: Xem tất cả feedback
    @GetMapping("/all")
    public ResponseEntity<List<FeedbackResponse>> getAllFeedback() {
        List<FeedbackResponse> responses = feedbackService.getAllFeedback();
        return ResponseEntity.ok(responses);
    }

    // Admin/Manager/Staff: Xem feedback theo appointment
    @GetMapping("/by-appointment/{appointmentId}")
    public ResponseEntity<FeedbackResponse> getByAppointment(@PathVariable Long appointmentId) {
        FeedbackResponse response = feedbackService.getFeedbackByAppointmentId(appointmentId);
        return ResponseEntity.ok(response);
    }

    // Admin: Xóa feedback vi phạm
    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long feedbackId) {
        feedbackService.deleteFeedback(feedbackId);
        return ResponseEntity.ok("Đã xóa feedback thành công");
    }

    // Admin/Manager: Thống kê feedback
    @GetMapping("/stats")
    public ResponseEntity<?> getFeedbackStats() {
        return ResponseEntity.ok(feedbackService.getFeedbackStats());
    }
}
