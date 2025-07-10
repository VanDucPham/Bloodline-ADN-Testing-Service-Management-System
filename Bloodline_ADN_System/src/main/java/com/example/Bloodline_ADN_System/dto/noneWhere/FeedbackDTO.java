package com.example.Bloodline_ADN_System.dto.noneWhere;

import lombok.Data;

@Data
public class FeedbackDTO {
    private Long userId;
    private Long serviceId;
    private Long appointmentId;
    private String feedbackText;
    private Integer rating;
}
