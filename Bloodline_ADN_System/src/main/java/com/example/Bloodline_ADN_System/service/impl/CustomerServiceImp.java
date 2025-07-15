package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.CaseFile;

import com.example.Bloodline_ADN_System.Entity.Participant;
import com.example.Bloodline_ADN_System.Entity.Result;
import com.example.Bloodline_ADN_System.Entity.Sample;

import com.example.Bloodline_ADN_System.Entity.Service;
import com.example.Bloodline_ADN_System.dto.noneWhere.ParticipantResponeDTO;
import com.example.Bloodline_ADN_System.dto.noneWhere.SampleDTO;
import com.example.Bloodline_ADN_System.dto.TrackingAppoint.AppointmentResponseDTO;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.AppointmentDTO;

import com.example.Bloodline_ADN_System.dto.managerCaseFile.AppointmentResponse;
import com.example.Bloodline_ADN_System.repository.AppointmentRepository;
import com.example.Bloodline_ADN_System.repository.ResultRepository;
import com.example.Bloodline_ADN_System.repository.ServiceRepository;

import com.example.Bloodline_ADN_System.service.CustomerService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
public class CustomerServiceImp implements CustomerService {

    private final AppointmentServiceImpl appointmentService;
    private final ServiceImpl serviceimp;
    private final CaseFileServiceImpl caseFileService;
    private final ParticipantServiceImpl participantService;
    private final ServiceImpl service_service;
    private final SampleServiceImpl sampleService;
    private final ResultRepository resultRepository;
    
    public CustomerServiceImp(AppointmentServiceImpl appointmentService, ServiceImpl serviceimp, CaseFileServiceImpl caseFileService, ParticipantServiceImpl participantService, ServiceImpl serviceService, SampleServiceImpl sampleService, ResultRepository resultRepository) {
        this.appointmentService = appointmentService;
        this.serviceimp = serviceimp;

        this.caseFileService = caseFileService;
        this.participantService = participantService;
        service_service = serviceService;
        this.sampleService = sampleService;
        this.resultRepository = resultRepository;
    }

    @Override
    public List<AppointmentResponseDTO> getAllAppointments(Long customerId) {
        List<AppointmentResponseDTO> newList = new ArrayList<>();
        List<AppointmentDTO> appointmentList = appointmentService.getAppointmentByUserId(customerId);

        for (AppointmentDTO appointment : appointmentList) {
            AppointmentResponseDTO dto = new AppointmentResponseDTO();
            dto.setAppointmentId(String.valueOf(appointment.getAppointmentId()));
            dto.setServiceId(appointment.getServiceId()); // Thêm serviceId
            dto.setUserId(appointment.getUserId()); // Thêm userId
            dto.setDate(appointment.getAppointmentDate());
            dto.setTime(appointment.getAppointmentTime());
            dto.setDelivery_method(appointment.getDeliveryMethod());
            dto.setCollection_Status(String.valueOf(appointment.getCollectionStatus()));
            dto.setKit_status(appointment.getKit_status());
            CaseFile caseFile = caseFileService.findById(appointmentService.findCaseIdByAppointmentId(appointment.getAppointmentId()));
            String caseCode = caseFile != null ? caseFile.getCaseCode() : "";
            String caseType = caseFile != null ? String.valueOf(caseFile.getCaseType()) : "";
            Optional<Service> optionalService = serviceimp.findServiceById(appointment.getServiceId());
            dto.setServiceName(optionalService.map(Service::getServiceName).orElse("Không rõ"));
            dto.setCaseCode(caseCode);
            dto.setCaseType(caseType);
            dto.setStatusAppointment(String.valueOf(appointment.getAppointmentStatus()));

            // ===== Lấy kết quả xét nghiệm từ bảng Result =====
            Optional<Result> resultOptional = resultRepository.findByAppointment_AppointmentId(appointment.getAppointmentId());
            if (resultOptional.isPresent()) {
                Result result = resultOptional.get();
                dto.setResult(result.getResultValue());
            } else {
                dto.setResult(null);
            }

            // ===== Lấy danh sách participant theo appointment =====
            List<ParticipantResponeDTO> participantList = participantService.getParticipantByAppointmentId(appointment.getAppointmentId());

            // Với mỗi participant, gắn sample
            for (ParticipantResponeDTO participant : participantList) {
                SampleDTO sample = sampleService.getSampleByParticipantId(participant.getParticipantId());
                participant.setSampleDTO(sample); // cần có setter
            }

            dto.setParticipantResponseDTOS(participantList); // gắn vào DTO
            newList.add(dto);
        }

        return newList;
    }

    @Override
    public void updateAppointment(AppointmentDTO appointmentDTO, Long appointmentId) {
        appointmentService.updateAppointment(appointmentDTO, appointmentId);
    }
}