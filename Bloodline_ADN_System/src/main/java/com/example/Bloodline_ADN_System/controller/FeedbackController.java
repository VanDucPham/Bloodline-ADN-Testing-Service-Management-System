package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.FeedbackDTO;
import com.example.Bloodline_ADN_System.dto.FeedbackResponse;
import com.example.Bloodline_ADN_System.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {
    private final FeedbackService  feedbackService;

    @PostMapping
    public ResponseEntity<FeedbackResponse> create(@RequestBody FeedbackDTO feedbackDTO) {
        FeedbackResponse response = feedbackService.createFeedback(feedbackDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-appointment/{appointmentId}")
    public ResponseEntity<FeedbackResponse> get(@PathVariable Long appointmentId) {
        FeedbackResponse response = feedbackService.getFeedbackByAppointmentId(appointmentId);
        return ResponseEntity.ok(response);
    }
}
