package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.Entity.Service;
import com.example.Bloodline_ADN_System.dto.AppointmentOfflineDTO;
import com.example.Bloodline_ADN_System.dto.AppointmentOfflineResponse;
import com.example.Bloodline_ADN_System.repository.AppointmentRepository;
import com.example.Bloodline_ADN_System.repository.ServiceRepository;
import com.example.Bloodline_ADN_System.service.AppointmentOfflineService;

@org.springframework.stereotype.Service
public class AppointmentOfflineServiceImpl implements AppointmentOfflineService {

    private final AppointmentRepository appointmentRepository;
    private final ServiceRepository serviceRepository;

    public AppointmentOfflineServiceImpl(AppointmentRepository appointmentRepository, ServiceRepository serviceRepository) {
        this.appointmentRepository = appointmentRepository;
        this.serviceRepository = serviceRepository;
    }

    public AppointmentOfflineResponse<AppointmentOfflineDTO> createAppointmentOffline(AppointmentOfflineDTO dto) {
        Service service = serviceRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại"));

        if (dto.getAppointmentType() == Appointment.AppointmentType.ADMINISTRATIVE &&
                dto.getDeliveryMethod() == Appointment.DeliveryMethod.HOME_COLLECTION) {
            throw new IllegalArgumentException("Hành chính chỉ được chọn dịch vụ tại cơ sở!");
        }
        Appointment appointment = new Appointment();
        appointment.setService(service);
        appointment.setType(dto.getAppointmentType());
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setAppointmentTime(dto.getAppointmentTime());
        appointment.setDeliverymethod(dto.getDeliveryMethod());
        appointment.setAppointmentNote(dto.getAppointmentNote());
        appointment.setStatus(Appointment.AppointmentStatus.SCHEDULED);

//        return appointmentRepository.save(appointment);
        Appointment saved = appointmentRepository.save(appointment);
        AppointmentOfflineDTO responseDto = toDTO(saved);

        return new AppointmentOfflineResponse<>("Đặt lịch thành công", responseDto);
    }

    public AppointmentOfflineDTO toDTO(Appointment appointment) {
        AppointmentOfflineDTO dto = new AppointmentOfflineDTO();
        dto.setServiceId(appointment.getService().getServiceId());
        dto.setAppointmentType(appointment.getType());
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setAppointmentTime(appointment.getAppointmentTime());
        dto.setDeliveryMethod(appointment.getDeliverymethod());
        dto.setAppointmentNote(appointment.getAppointmentNote());
        return dto;
    }

}