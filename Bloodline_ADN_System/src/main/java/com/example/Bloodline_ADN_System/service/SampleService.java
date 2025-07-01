package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.Entity.Sample;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.SampleCustomerDTO;
import com.example.Bloodline_ADN_System.dto.SampleDTO;
import com.example.Bloodline_ADN_System.dto.SampleStaffDTO;
import com.example.Bloodline_ADN_System.dto.SampleUpdateDTO;

import java.util.List;

public interface SampleService {
    List<SampleDTO> createSamplesByCustomer(List<SampleCustomerDTO> dtoList);
    List<SampleDTO> createSampleByStaff(List<SampleStaffDTO> dtoList);
    SampleDTO updateSampleInfo(SampleUpdateDTO dto);
    SampleDTO getSampleByParticipantId(Long participantId);

    void saveAll(List<Sample> samples);
}