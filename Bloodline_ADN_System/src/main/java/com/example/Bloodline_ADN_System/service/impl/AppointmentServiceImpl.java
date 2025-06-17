package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.Entity.Service;
import com.example.Bloodline_ADN_System.Entity.User;
import com.example.Bloodline_ADN_System.dto.AppointmentDTO;
import com.example.Bloodline_ADN_System.dto.AppointmentResponse;
import com.example.Bloodline_ADN_System.repository.AppointmentRepository;
import com.example.Bloodline_ADN_System.repository.ServiceRepository;
import com.example.Bloodline_ADN_System.repository.UserRepository;

@org.springframework.stereotype.Service
public class AppointmentServiceImpl implements com.example.Bloodline_ADN_System.service.AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, UserRepository userRepository, ServiceRepository serviceRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
    }

    public AppointmentResponse<AppointmentDTO> createAppointment(AppointmentDTO dto) {
        // Lấy thông tin người dùng hiện tại
//        String currentEmail = getCurrentUserEmail();
//        User user = userRepository.findByEmail(currentEmail)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng đang đăng nhập"));
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        Service service = serviceRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại"));

        if (dto.getAppointmentType() == Appointment.AppointmentType.ADMINISTRATIVE &&
                dto.getDeliveryMethod() == Appointment.DeliveryMethod.HOME_COLLECTION) {
            throw new IllegalArgumentException("Hành chính chỉ được chọn dịch vụ tại cơ sở!");
        }
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setService(service);
        appointment.setType(dto.getAppointmentType());
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setAppointmentTime(dto.getAppointmentTime());
        appointment.setDeliverymethod(dto.getDeliveryMethod());
        appointment.setAppointmentNote(dto.getAppointmentNote());
        appointment.setStatus(Appointment.AppointmentStatus.SCHEDULED);

//        return appointmentRepository.save(appointment);
        Appointment saved = appointmentRepository.save(appointment);
        AppointmentDTO responseDto = toDTO(saved);

        return new AppointmentResponse<>("Đặt lịch thành công", responseDto);
    }

    public AppointmentDTO toDTO(Appointment appointment) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setUserId(appointment.getUser().getUserId());
        dto.setServiceId(appointment.getService().getServiceId());
        dto.setAppointmentType(appointment.getType());
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setAppointmentTime(appointment.getAppointmentTime());
        dto.setDeliveryMethod(appointment.getDeliverymethod());
        dto.setAppointmentNote(appointment.getAppointmentNote());
        return dto;
    }

}
