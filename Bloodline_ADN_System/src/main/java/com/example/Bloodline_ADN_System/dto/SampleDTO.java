package com.example.Bloodline_ADN_System.dto;

import com.example.Bloodline_ADN_System.Entity.Sample;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SampleDTO {
    private Long sampleId;
    private Long participantId;
    private Sample.SampleType sampleType;
    private LocalDateTime collectionDateTime;
    private Sample.SampleQuality quality;
    private Sample.SampleStatus status;
    private String result;
    private String notes;
}
