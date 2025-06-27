package com.example.Bloodline_ADN_System.dto.managerCaseFile;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;
@Data
public class caseFileDTO {
    private String caseCode;
    private String caseType; // ADMINISTRATIVE, CIVIL
    private String status;   // ACTIVE, CLOSED, CANCELLED,...
    private Long serviceId;  // Optional
    private Long createdByUserId;
}

