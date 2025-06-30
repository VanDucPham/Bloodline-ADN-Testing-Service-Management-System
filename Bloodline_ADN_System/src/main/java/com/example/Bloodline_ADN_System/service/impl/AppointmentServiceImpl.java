
package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.*;
import com.example.Bloodline_ADN_System.dto.SampleDTO;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.AppointmentDTO;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.AppointmentRequest;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.AppointmentResponse;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.ParticipantDTO;
import com.example.Bloodline_ADN_System.repository.*;
import com.example.Bloodline_ADN_System.service.AppointmentService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final ParticipantRepository participantRepository;
    private final SampleRepository sampleRepository;
    private final CaseFileRepository caseFileRepository;
    private final CaseFileServiceImpl caseFileService;
    private final TimeSlotLimitRepository timeSlotLimitRepository;
    private final ServiceRepository serviceRepository;

    public AppointmentServiceImpl(CaseFileRepository caseFileRepository,
                                  ParticipantRepository participantRepository,
                                  AppointmentRepository appointmentRepository,
                                  UserRepository userRepository,
                                  SampleRepository sampleRepository,
                                  TimeSlotLimitRepository timeSlotLimitRepository,
                                  CaseFileServiceImpl caseFileService,
                                  ServiceRepository serviceRepository) {
        this.appointmentRepository = appointmentRepository;
        this.participantRepository = participantRepository;
        this.userRepository = userRepository;
        this.sampleRepository = sampleRepository;
        this.timeSlotLimitRepository = timeSlotLimitRepository;
        this.caseFileRepository = caseFileRepository;
        this.caseFileService = caseFileService;
        this.serviceRepository = serviceRepository;
    }

    // --------------------- CUSTOMER CREATE APPOINTMENT ---------------------
    @Override
    public AppointmentResponse<AppointmentDTO> createAppointmentByStaff(AppointmentDTO dto) {
        validateAppointmentDate(dto.getAppointmentDate());
        validateSlotAvailability(dto.getAppointmentDate(), dto.getAppointmentTime());


        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        Service service = (Service) serviceRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại"));

        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setService((com.example.Bloodline_ADN_System.Entity.Service) service);
        appointment.setType(dto.getAppointmentType());
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setAppointmentTime(dto.getAppointmentTime());
        appointment.setDeliveryMethod(Appointment.DeliveryMethod.valueOf(dto.getDeliveryMethod()));
        appointment.setAppointmentNote(dto.getAppointmentNote());
        appointment.setStatus(Appointment.AppointmentStatus.SCHEDULED);

        Appointment saved = appointmentRepository.save(appointment);
        return new AppointmentResponse<>("Đặt lịch thành công", toDTO(saved));
    }

    private void validateAppointmentDate(LocalDate date) {
        LocalDate today = LocalDate.now();
        if (!date.isAfter(today)) {
            throw new IllegalArgumentException("Lịch hẹn phải được đặt trước ít nhất 1 ngày.");
        }
    }

    private void validateSlotAvailability(LocalDate date, LocalTime time) {
        int count = appointmentRepository.countByAppointmentDateAndAppointmentTime(date, time);
        if (count >= 3) {
            throw new IllegalArgumentException("Khung giờ đã đầy. Vui lòng chọn khung giờ khác.");
        }
    }

//    private void validateServiceCombination(AppointmentDTO dto) {
//        if (dto.getAppointmentType() == Appointment.AppointmentType.ADMINISTRATIVE &&
//                dto.getDeliveryMethod() == Appointment.DeliveryMethod.HOME_COLLECTION) {
//            throw new IllegalArgumentException("Hành chính chỉ được chọn dịch vụ tại cơ sở!");
//        }
//    }

    // --------------------- CUSTOMER CREATE FULL APPOINTMENT ---------------------
    @Override
    @Transactional
    public AppointmentResponse<AppointmentDTO> createAppointment(AppointmentRequest request) {
        CaseFile savedCaseFile = request.getCaseFile();
        savedCaseFile.setCaseCode(caseFileService.generateCaseCode(String.valueOf(savedCaseFile.getCaseType())));
        CaseFile caseFile = caseFileRepository.save(savedCaseFile);

        Appointment appointment = request.getAppointment();
        appointment.setCaseFile(savedCaseFile);
        Appointment savedAppointment = appointmentRepository.save(appointment);

        Map<String, Participant> participantMap = request.getParticipants().stream()
                .map(p -> {
                    p.setAppointment(savedAppointment);
                    return participantRepository.save(p);
                })
                .collect(Collectors.toMap(Participant::getCitizenId, p -> p));

        for (SampleDTO sampleDto : request.getSamples()) {
            Participant participant = participantMap.get(sampleDto.getParticipantCitizenId());
            if (participant == null) {
                throw new RuntimeException("Không tìm thấy participant với CCCD: " + sampleDto.getParticipantCitizenId());
            }

            Sample sample = new Sample();
            sample.setParticipant(participant);
            sample.setSampleType(sampleDto.getSampleType());
            sample.setCollectionDateTime(sampleDto.getCollectionDateTime());
            sample.setQuality(sampleDto.getQuality());
            sample.setStatus(sampleDto.getStatus());
            sample.setResult(sampleDto.getResult());
            sample.setNotes(sampleDto.getNotes());
            sampleRepository.save(sample);
        }

        AppointmentDTO dto = toDTO(savedAppointment);
        dto.setCaseCode(caseFile.getCaseCode());
        dto.setParticipants(request.getParticipants().stream().map(this::toParticipantDTO).toList());
        dto.setSamples(request.getSamples().stream().map(this::toSampleDTO).toList());

        return new AppointmentResponse<>("Tạo lịch hẹn thành công!", dto);
    }

    private ParticipantDTO toParticipantDTO(Participant p) {
        return new ParticipantDTO(p.getParticipantId(), p.getName(), p.getRelationship(), p.getCitizenId(),
                p.getAddress(), p.getBirthDate(), p.getGender());
    }

    private SampleDTO toSampleDTO(SampleDTO s) {
        return new SampleDTO(s.getSampleId(), s.getParticipantId(), s.getParticipantCitizenId(),
                s.getParticipantName(), s.getSampleType(), s.getCollectionDateTime(),
                s.getQuality(), s.getStatus(), s.getResult(), s.getNotes());
    }

    @Override
    public boolean checkAvailability(LocalDate date, LocalTime time, String email) {
        if (date.isBefore(LocalDate.now()) || (date.isEqual(LocalDate.now()) && time.isBefore(LocalTime.now()))) {
            return false;
        }

        Optional<TimeSlotLimit> slotOpt = timeSlotLimitRepository.findByStartTimeLessThanEqualAndEndTimeGreaterThanEqual(time, time);
        if (slotOpt.isEmpty()) return false;

        TimeSlotLimit slot = slotOpt.get();
        int currentAppointments = appointmentRepository.countByAppointmentDateAndAppointmentTimeBetween(date, slot.getStartTime(), slot.getEndTime());
        if (currentAppointments >= slot.getMaxAppointments()) return false;

        Long userId = getUserIdByUsername(email);
        return !appointmentRepository.existsByUser_UserIdAndAppointmentDateAndAppointmentTimeBetween(
                userId, date, slot.getStartTime(), slot.getEndTime());
    }

    @Override
    public Long getUserIdByUsername(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"))
                .getUserId();
    }

    @Override
    public boolean isUserIdExist(Long userId) {
        return userRepository.existsById(userId);
    }

    @Override
    public List<AppointmentDTO> getAllAppointment() {
        return appointmentRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public List<AppointmentDTO> getAppointmentByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Người dùng không tồn tại");
        }
        return appointmentRepository.findByUserUserId(userId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public void cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lịch hẹn không tồn tại"));

        if (!appointment.getAppointmentDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Chỉ được phép hủy lịch trước ít nhất 1 ngày.");
        }

        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    @Override
    public List<AppointmentDTO> filterAppointment(Appointment.AppointmentStatus status,
                                                  Appointment.AppointmentType type,
                                                  LocalDate date) {
        return appointmentRepository.findByFilters(status, type, date)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AppointmentDTO updateAppointmentProgress(Long id, Appointment.AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lịch hẹn không tồn tại!"));

        appointment.setStatus(status);
        return toDTO(appointmentRepository.save(appointment));
    }

    public AppointmentDTO toDTO(Appointment appointment) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setAppointmentId(appointment.getAppointmentId());
        dto.setUserId(appointment.getUser().getUserId());
        dto.setServiceId(appointment.getService().getServiceId());
        dto.setAppointmentType(appointment.getType());
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setAppointmentTime(appointment.getAppointmentTime());
        dto.setAppointmentStatus(appointment.getStatus());
        dto.setDeliveryMethod(String.valueOf(appointment.getDeliveryMethod()));
        dto.setAppointmentNote(appointment.getAppointmentNote());
        return dto;
    }
}


