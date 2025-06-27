package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.Participant;
import com.example.Bloodline_ADN_System.Entity.Sample;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.SampleCustomerDTO;
import com.example.Bloodline_ADN_System.dto.SampleDTO;
import com.example.Bloodline_ADN_System.dto.SampleStaffDTO;
import com.example.Bloodline_ADN_System.dto.SampleUpdateDTO;
import com.example.Bloodline_ADN_System.repository.ParticipantRepository;
import com.example.Bloodline_ADN_System.repository.SampleRepository;
import com.example.Bloodline_ADN_System.service.SampleService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SampleServiceImpl implements SampleService {
    private final SampleRepository sampleRepository;
    private final ParticipantRepository participantRepository;
    public SampleServiceImpl(SampleRepository samppleRepository, ParticipantRepository participantRepository) {
        this.sampleRepository = samppleRepository;
        this.participantRepository = participantRepository;
    }

    //Khách hàng điền sample với dịch vụ tự lấy mẫu tại nhà
    @Override
    public List<SampleDTO> createSamplesByCustomer(List<SampleCustomerDTO> dtoList) {
        return dtoList.stream().map(dto -> {
            Participant participant = participantRepository.findById(dto.getParticipantId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người tham gia"));
            Sample sample = new Sample();
            sample.setParticipant(participant);
            sample.setSampleType(dto.getSampleType());
            sample.setCollectionDateTime(dto.getCollectionDateTime());
            sample.setStatus(Sample.SampleStatus.COLLECTED);
            sample.setQuality(null);
            sample.setResult(null);
            sample.setNotes(null);

            return toDTO(sampleRepository.save(sample));
        }).collect(Collectors.toList());
    }

    //Nhân viên điền sample đối với dịch vụ lấy mẫu tại cơ sở
    public List<SampleDTO> createSampleByStaff(List<SampleStaffDTO> dtoList){
        return dtoList.stream().map(dto ->{
            Participant participant = participantRepository.findById(dto.getParticipantId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người tham gia"));
            Sample sample = new Sample();
            sample.setParticipant(participant);
            sample.setSampleType(dto.getSampleType());
            sample.setCollectionDateTime(dto.getCollectionDateTime());
            sample.setStatus(Sample.SampleStatus.COLLECTED);
            sample.setQuality(dto.getQuality());
            sample.setResult(dto.getResult());
            sample.setNotes(dto.getNotes());

            return toDTO(sampleRepository.save(sample));

        }).collect(Collectors.toList());
    }

    //Nhân viên điền thêm thông tin cho sample sau khi nhận được mẫu dành cho dịch vụ tự lấy mẫu
    public SampleDTO updateSampleInfo(SampleUpdateDTO dto) {
        Sample sample = sampleRepository.findById(dto.getSampleId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu"));
        sample.setQuality(dto.getQuality());
        sample.setStatus(Sample.SampleStatus.ANALYZED);
        sample.setResult(dto.getResult());
        sample.setNotes(dto.getNotes());
        return toDTO(sampleRepository.save(sample));
    }

    private SampleDTO toDTO(Sample sample) {
        SampleDTO dto = new SampleDTO();
        dto.setSampleId(sample.getSampleId());
        dto.setParticipantId(sample.getParticipant().getParticipantId());
        dto.setSampleType(sample.getSampleType());
        dto.setCollectionDateTime(sample.getCollectionDateTime());
        dto.setQuality(sample.getQuality());
        dto.setStatus(sample.getStatus());
        dto.setResult(sample.getResult());
        dto.setNotes(sample.getNotes());
        return dto;
    }


}