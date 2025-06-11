package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.Entity.Sample;
import com.example.Bloodline_ADN_System.repository.SampleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SampleService {

    private final SampleRepository sampleRepository;

    public void updateSampleStatus(Long sampleId, Sample.SampleStatus status) {
        Sample sample = sampleRepository.findById(sampleId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy mẫu."));

        sample.setStatus(status);
        sampleRepository.save(sample);
    }
}
