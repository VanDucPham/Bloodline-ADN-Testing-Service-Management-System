package com.example.Bloodline_ADN_System.dto;

import com.example.Bloodline_ADN_System.Entity.Result;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ResultResponseDTO {
    private Long appointmentId;
    private Result.TestType testType;
    private String resultValue;
    private LocalDateTime resultDate;
    private Result.ResultStatus status;
    private String notes;
}
