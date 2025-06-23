package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.Entity.Service;
import com.example.Bloodline_ADN_System.Entity.User;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.AppointmentDTO;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.AppointmentResponse;
import com.example.Bloodline_ADN_System.repository.AppointmentRepository;
import com.example.Bloodline_ADN_System.repository.ServiceRepository;
import com.example.Bloodline_ADN_System.repository.UserRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

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

//    //Customer tạo lịch hẹn

public AppointmentResponse<AppointmentDTO> createAppointment(AppointmentDTO dto) {

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

//    // Lấy tất cả case của user hiện tại
//    public List<Appointment> getAppointmentsForCurrentUser(Long currentUserId) {
//        return appointmentRepository.findByUserId(currentUserId);
//    }
//
//    // Lấy case theo id nếu thuộc về user
//    public Appointment getAppointmentForCurrentUser(Long currentUserId, Long id) {
//        Appointment appointment = appointmentRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Not found."));
//        if (!appointment.getUser().getId().equals(currentUserId)) {
//            throw new SecurityException("Not authorized.");
//        }
//        return appointment;
//    }

}
