package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.Entity.*;
import com.example.Bloodline_ADN_System.dto.OfflineRegisterRequestDTO;
import com.example.Bloodline_ADN_System.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class OfflineRegisterService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final ServiceRepository serviceRepository;
    private final ParticipantRepository participantRepository;
    private final SampleRepository sampleRepository;

    public void createOfflineRegister(OfflineRegisterRequestDTO dto) {

        // ✅ 1. Lấy user từ userId
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng."));

        // ✅ 2. Lấy service từ serviceId
        com.example.Bloodline_ADN_System.Entity.Service service =
                serviceRepository.findById(dto.getServiceId())
                        .orElseThrow(() -> new IllegalArgumentException("Dịch vụ không tồn tại."));

        // ✅ 3. Tạo appointment
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setService(service);
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setAppointmentTime(dto.getAppointmentTime());
        appointment.setAppointmentNote(dto.getAppointmentNote());
        appointment.setStatus(Appointment.AppointmentStatus.SCHEDULED);
        appointment.setType(Appointment.AppointmentType.CIVIL);
        appointment.setDeliverymethod(Appointment.DeliveryMethod.SELF_DROP_OFF);
        appointmentRepository.save(appointment);

        // ✅ 4. Tạo participant và sample
        for (OfflineRegisterRequestDTO.ParticipantDTO pDto : dto.getParticipants()) {
            Participant participant = new Participant();
            participant.setName(pDto.getName());
            participant.setRelationship(pDto.getRelationship());
            participant.setGender(Participant.Gender.valueOf(pDto.getGender().toUpperCase(Locale.ROOT)));
            participant.setCitizenId(pDto.getCitizenId());
            participant.setAddress(pDto.getAddress());
            participant.setBirthDate(pDto.getBirthDate());
            participant.setAppointment(appointment);
            participantRepository.save(participant);

            appointment.getParticipants().add(participant);

            Sample sample = new Sample();
            sample.setParticipant(participant);
            sample.setSampleType(Sample.SampleType.valueOf(pDto.getSampleType()));
            sample.setNotes(pDto.getSampleNote());
            sampleRepository.save(sample);
        }

        appointmentRepository.save(appointment);
    }
}
