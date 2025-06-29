
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

    public AppointmentServiceImpl(CaseFileRepository caseFileRepository,ParticipantRepository participantRepository, AppointmentRepository appointmentRepository, UserRepository userRepository, SampleRepository sampleRepository, TimeSlotLimitRepository timeSlotLimitRepository, CaseFileServiceImpl caseFileService ) {
        this.appointmentRepository = appointmentRepository;
        this.participantRepository = participantRepository;
        this.userRepository = userRepository;
        this.sampleRepository = sampleRepository;
        this.timeSlotLimitRepository = timeSlotLimitRepository;
        this.caseFileRepository = caseFileRepository;
        this.caseFileService = caseFileService;

    }
  
     private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, UserRepository userRepository, ServiceRepository serviceRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
    }

    //Customer tạo lịch hẹn
    public AppointmentResponse<AppointmentDTO> createAppointmentByStaff(AppointmentDTO dto) {

        // Kiểm tra ngày giờ
        LocalDate appointmentDate = dto.getAppointmentDate();
        LocalTime appointmentTime = dto.getAppointmentTime();
        LocalDate today = LocalDate.now();

        if (appointmentDate.isBefore(today)) {
            throw new IllegalArgumentException("Không thể đặt lịch trong quá khứ.");
    }

        if (!appointmentDate.isAfter(today)) {
            throw new IllegalArgumentException("Lịch hẹn phải được đặt trước ít nhất 1 ngày.");
    }

        // Kiểm tra số lượng lịch hẹn trong khung giờ đã đầy chưa
        int count = appointmentRepository.countByAppointmentDateAndAppointmentTime(appointmentDate, appointmentTime);
        if (count >= 3) {
            throw new IllegalArgumentException("Khung giờ đã đầy. Vui lòng chọn khung giờ khác.");
    }

    // Tìm user và service
        User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        Service service = serviceRepository.findById(dto.getServiceId())
            .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại"));

        // Ràng buộc loại dịch vụ
        if (dto.getAppointmentType() == Appointment.AppointmentType.ADMINISTRATIVE &&
            dto.getDeliveryMethod() == Appointment.DeliveryMethod.HOME_COLLECTION) {
            throw new IllegalArgumentException("Hành chính chỉ được chọn dịch vụ tại cơ sở!");
    }

    // Tạo mới lịch hẹn
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setService(service);
        appointment.setType(dto.getAppointmentType());
        appointment.setAppointmentDate(appointmentDate);
        appointment.setAppointmentTime(appointmentTime);
        appointment.setDeliverymethod(dto.getDeliveryMethod());
        appointment.setAppointmentNote(dto.getAppointmentNote());
        appointment.setStatus(Appointment.AppointmentStatus.SCHEDULED);

        Appointment saved = appointmentRepository.save(appointment);
        AppointmentDTO responseDto = toDTO(saved);

    return new AppointmentResponse<>("Đặt lịch thành công", responseDto);
}


    //Manager xem tất cả các lịch hẹn
    public List<AppointmentDTO> getAllAppointment() {
        return appointmentRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    //Customer xem tất cả các lịch hẹn của họ
    public List<AppointmentDTO> getAppointmentByUserId(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        return appointmentRepository.findByUserUserId(userId).stream().map(this::toDTO).toList();
    }

    //Customer hủy lịch hẹn
    public void cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lịch hẹn không tồn tại"));

        LocalDate today = LocalDate.now();

        if (!appointment.getAppointmentDate().isAfter(today)) {
            throw new IllegalArgumentException("Chỉ được phép hủy lịch trước ít nhất 1 ngày.");
        }

        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    //Lọc appointment cho staff và manager
    public List<AppointmentDTO> filterAppointment(Appointment.AppointmentStatus status, Appointment.AppointmentType type, LocalDate date) {
        List<Appointment> appointment = appointmentRepository.findByFilters(status, type, date);
        return appointment.stream().map(this::toDTO).collect(Collectors.toList());
    }

    //Cập nhật tiến trình cho appointment
    public AppointmentDTO updateAppointmentProgress(Long id, Appointment.AppointmentStatus status) {
        Appointment appointment =appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Lịch hẹn không tồn tại!"));
        appointment.setStatus(status);
        appointment.setStatus(status);
        Appointment updated = appointmentRepository.save(appointment);

        return toDTO(updated);
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
        dto.setDeliveryMethod(appointment.getDeliverymethod());
        dto.setAppointmentNote(appointment.getAppointmentNote());
        return dto;
    }
  
    @Override
    public boolean checkAvailability(LocalDate date, LocalTime time, String email) {


        System.out.println("Checking availability 111111111");
        if (date.isBefore(LocalDate.now()) || (date.isEqual(LocalDate.now()) && time.isBefore(LocalTime.now()))) {
            System.out.println("check availability");
            return false; // Reject past dates and times
        }

        Optional<TimeSlotLimit> slotOpt = timeSlotLimitRepository.findByStartTimeLessThanEqualAndEndTimeGreaterThanEqual(time, time);
        if (slotOpt.isEmpty()) {
            System.out.println("check  nulll ");
            return false;
        }
        TimeSlotLimit slot = slotOpt.get();
        int currentAppointments = appointmentRepository.countByAppointmentDateAndAppointmentTimeBetween(date, slot.getStartTime(), slot.getEndTime());

        if (currentAppointments >= slot.getMaxAppointments()) {
            System.out.println("Appointment limit exceeded");
            return false; // Slot is full
        }

        Long userId = getUserIdByUsername(email);
        boolean userAlreadyHasAppointment = appointmentRepository.existsByUser_UserIdAndAppointmentDateAndAppointmentTimeBetween(userId, date, slot.getStartTime(), slot.getEndTime());
        System.out.println("đã vào đây");
        return !userAlreadyHasAppointment;
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
    @Transactional
    public AppointmentResponse<AppointmentDTO> createAppointment(AppointmentRequest request) {
        // 1. Lưu hồ sơ CaseFile
        CaseFile savedCaseFile = request.getCaseFile();
        savedCaseFile.setCaseCode(caseFileService.generateCaseCode(String.valueOf(request.getCaseFile().getCaseType())));
        CaseFile caseFile = caseFileRepository.save(savedCaseFile);
        // 2. Tạo và lưu Appointment
        Appointment appointment = request.getAppointment();
        appointment.setCaseFile(savedCaseFile);
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // 3. Lưu danh sách Participants và tạo Map<CCCD, Participant>
        Map<String, Participant> citizenIdToParticipant = request.getParticipants()
                .stream()
                .map(p -> {
                    p.setAppointment(savedAppointment);
                    return participantRepository.save(p);
                })
                .collect(Collectors.toMap(Participant::getCitizenId, p -> p));

        // 4. Lưu danh sách Samples
        for (SampleDTO sampleDto : request.getSamples()) {
            Participant participant = citizenIdToParticipant.get(sampleDto.getParticipantCitizenId());

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

        // 5. Chuẩn bị dữ liệu trả về: AppointmentDTO
        AppointmentDTO dto = new AppointmentDTO();
        dto.setAppointmentId(savedAppointment.getAppointmentId());
        dto.setAppointmentDate(savedAppointment.getAppointmentDate());
        dto.setAppointmentTime(savedAppointment.getAppointmentTime());
        dto.setDeliveryMethod(String.valueOf(savedAppointment.getDeliveryMethod()));
        dto.setCaseCode(
                Optional.ofNullable(savedAppointment.getCaseFile())
                        .map(CaseFile::getCaseCode)
                        .orElse(null)
        );

        // Participants DTO
        List<ParticipantDTO> participantDTOs = request.getParticipants().stream()
                .map(p -> new ParticipantDTO(
                        p.getParticipantId(),
                        p.getName(),
                        p.getRelationship(),
                        p.getCitizenId(),
                        p.getAddress(),
                        p.getBirthDate(),
                        p.getGender()
                ))
                .collect(Collectors.toList());
        dto.setParticipants(participantDTOs);

        // Samples DTO
        List<SampleDTO> sampleDTOs = request.getSamples().stream()
                .map(s -> new SampleDTO(
                        s.getSampleId(),
                        s.getParticipant() != null ? s.getParticipant().getParticipantId() : null,
                        s.getParticipantCitizenId(),
                        s.getParticipant() != null ? s.getParticipant().getName() : null,
                        s.getSampleType(),
                        s.getCollectionDateTime(),
                        s.getQuality(),
                        s.getStatus(),
                        s.getResult(),
                        s.getNotes()
                ))
                .collect(Collectors.toList());
        dto.setSamples(sampleDTOs);

        return new AppointmentResponse<>("Tạo lịch hẹn thành công!", dto);
    }




    @Override
    public List<AppointmentDTO> getAllAppointment() {
        return List.of();
    }

    @Override
    public List<AppointmentDTO> getAppointmentByUserId(Long userId) {
        return List.of();
    }

    @Override
    public void cancelAppointment(Long id) {

    }

    @Override
    public List<AppointmentDTO> filterAppointment(Appointment.AppointmentStatus status, Appointment.AppointmentType type, LocalDate date) {
        return List.of();
    }

    @Override
    public AppointmentDTO updateAppointmentProgress(Long id, Appointment.AppointmentStatus status) {
        return null;
    }

}

