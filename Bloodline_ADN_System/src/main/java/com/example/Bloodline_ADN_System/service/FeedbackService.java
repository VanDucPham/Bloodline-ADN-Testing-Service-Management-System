package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.dto.FeedbackDTO;
import com.example.Bloodline_ADN_System.dto.FeedbackResponse;

public interface FeedbackService {
    FeedbackResponse createFeedback(FeedbackDTO feedbackDTO);
    FeedbackResponse getFeedbackByAppointmentId(Long appointmentId);
}
