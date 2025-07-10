package com.example.Bloodline_ADN_System.dto.noneWhere;

import com.example.Bloodline_ADN_System.Entity.Sample;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SampleStaffDTO {
    private Long participantId;
    private String sampleType;
    private LocalDateTime collectionDateTime;
    private Sample.SampleQuality quality;
    private Sample.SampleStatus status;
    private String result;
    private String notes;
}