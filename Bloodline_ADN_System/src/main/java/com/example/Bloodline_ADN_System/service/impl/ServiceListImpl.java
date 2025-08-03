package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.ParticipantType;
import com.example.Bloodline_ADN_System.Entity.Service;
import com.example.Bloodline_ADN_System.dto.ManagerService.ServiceManagerDTO;
import com.example.Bloodline_ADN_System.dto.ParticipantTypeDTO;
import com.example.Bloodline_ADN_System.dto.noneWhere.ServiceDTO;
import com.example.Bloodline_ADN_System.repository.ServiceRepository;
import com.example.Bloodline_ADN_System.repository.AppointmentRepository;
import com.example.Bloodline_ADN_System.repository.FeedbackRepository;
import com.example.Bloodline_ADN_System.repository.CaseFileRepository;
import com.example.Bloodline_ADN_System.repository.ParticipantTypeRepository;
import com.example.Bloodline_ADN_System.service.ServiceList;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class ServiceListImpl implements ServiceList {

    private final ServiceRepository serviceRepository;
    private final AppointmentRepository appointmentRepository;
    private final FeedbackRepository feedbackRepository;
    private final CaseFileRepository caseFileRepository;
    private final ParticipantTypeRepository participantTypeRepository;

    public ServiceListImpl(ServiceRepository serviceRepository,
                           AppointmentRepository appointmentRepository,
                           FeedbackRepository feedbackRepository,
                           CaseFileRepository caseFileRepository,
                           ParticipantTypeRepository participantTypeRepository) {
        this.serviceRepository = serviceRepository;
        this.appointmentRepository = appointmentRepository;
        this.feedbackRepository = feedbackRepository;
        this.caseFileRepository = caseFileRepository;
        this.participantTypeRepository = participantTypeRepository;
    }

    // Lấy toàn bộ dịch vụ
    public List<ServiceManagerDTO> getAllServices() {
        return serviceRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Lấy dịch vụ theo ID
    public ServiceManagerDTO getServiceById(Long id) {
        return toDTO(serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại")));
    }

    // Tạo dịch vụ mới
    public ServiceManagerDTO createService(ServiceManagerDTO dto) {
        if (serviceRepository.existsByServiceName(dto.getServiceName())) {
            throw new IllegalArgumentException("Tên dịch vụ đã tồn tại");
        }

        Service service = new Service();
        service.setServiceDescription(dto.getServiceDescription());
        service.setServiceName(dto.getServiceName());
        service.setServicePrice(dto.getServicePrice());
        service.setImageUrl(dto.getImageUrl());
        service.setLimitPeople(dto.getLimitPeople());

        // Lấy danh sách participant type từ DB
        List<ParticipantType> participantTypes = dto.getParticipantsType().stream()
                .map(pt -> participantTypeRepository.findById(Long.valueOf(pt.getId()))
                        .orElseThrow(() -> new RuntimeException("Loại người tham gia không tồn tại: " + pt.getId())))
                .collect(Collectors.toList());
        service.setParticipantType(participantTypes);

        return toDTO(serviceRepository.save(service));
    }

    // Cập nhật dịch vụ
    public ServiceManagerDTO updateService(Long id, ServiceManagerDTO updateDTO) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại"));

        long appointmentCount = appointmentRepository.countByService_ServiceId(id);
        long feedbackCount = feedbackRepository.countByService_ServiceId(id);
        long caseFileCount = caseFileRepository.countByService_ServiceId(id);

        boolean isInUse = (appointmentCount > 0 || feedbackCount > 0 || caseFileCount > 0);

        if (isInUse) {
            // Nếu đang sử dụng -> chặn chỉnh sửa các trường nhạy cảm
            if (!updateDTO.getServiceName().equals(service.getServiceName()) ||
                    !updateDTO.getLimitPeople().equals(service.getLimitPeople()) ||
                    !updateDTO.getServicePrice().equals(service.getServicePrice()) ||
                    !updateDTO.getParticipantsType().stream().map(ParticipantTypeDTO::getId).collect(Collectors.toSet())
                            .equals(service.getParticipantType().stream().map(ParticipantType::getParticipantId).collect(Collectors.toSet()))) {
                throw new RuntimeException("Không thể chỉnh sửa tên, giá, số người hoặc loại người tham gia khi dịch vụ đang được sử dụng.");
            }

            // Cho phép sửa ảnh + mô tả
            service.setImageUrl(updateDTO.getImageUrl());
            service.setServiceDescription(updateDTO.getServiceDescription());
        } else {
            // Nếu chưa sử dụng -> cho phép sửa toàn bộ
            // Kiểm tra trùng tên nếu đổi tên
            if (!service.getServiceName().equals(updateDTO.getServiceName()) &&
                    serviceRepository.existsByServiceName(updateDTO.getServiceName())) {
                throw new RuntimeException("Tên dịch vụ đã tồn tại");
            }

            service.setLimitPeople(updateDTO.getLimitPeople());
            service.setImageUrl(updateDTO.getImageUrl());
            service.setServiceName(updateDTO.getServiceName());
            service.setServiceDescription(updateDTO.getServiceDescription());
            service.setServicePrice(updateDTO.getServicePrice());

            // Cập nhật participant types
            List<ParticipantType> participantTypes = updateDTO.getParticipantsType().stream()
                    .map(pt -> participantTypeRepository.findById(Long.valueOf(pt.getId()))
                            .orElseThrow(() -> new RuntimeException("Loại người tham gia không tồn tại: " + pt.getId())))
                    .collect(Collectors.toList());
            service.setParticipantType(participantTypes);
        }

        return toDTO(serviceRepository.save(service));
    }

    // Xóa dịch vụ
    public void deleteService(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại"));

        // Kiểm tra xem service có đang được sử dụng không
        long appointmentCount = appointmentRepository.countByService_ServiceId(id);
        long feedbackCount = feedbackRepository.countByService_ServiceId(id);
        long caseFileCount = caseFileRepository.countByService_ServiceId(id);

        if (appointmentCount > 0 || feedbackCount > 0 || caseFileCount > 0) {
            StringBuilder errorMessage = new StringBuilder("Không thể xóa dịch vụ này vì đang được sử dụng: ");
            if (appointmentCount > 0) {
                errorMessage.append("Có ").append(appointmentCount).append(" lịch hẹn, ");
            }
            if (feedbackCount > 0) {
                errorMessage.append("Có ").append(feedbackCount).append(" đánh giá, ");
            }
            if (caseFileCount > 0) {
                errorMessage.append("Có ").append(caseFileCount).append(" hồ sơ, ");
            }
            errorMessage.setLength(errorMessage.length() - 2);
            throw new RuntimeException(errorMessage.toString());
        }

        serviceRepository.deleteById(id);
    }

    // Mapping methods
    public ServiceManagerDTO toDTO(Service service) {
        long appointmentCount = appointmentRepository.countByService_ServiceId(service.getServiceId());
        long feedbackCount = feedbackRepository.countByService_ServiceId(service.getServiceId());
        long caseFileCount = caseFileRepository.countByService_ServiceId(service.getServiceId());
        boolean isInUse = (appointmentCount > 0 || feedbackCount > 0 || caseFileCount > 0);

        return new ServiceManagerDTO(
                service.getServiceId(),
                service.getServiceName(),
                service.getServiceDescription(),
                service.getLimitPeople(),
                service.getParticipantType().stream()
                        .map(pt -> new ParticipantTypeDTO(pt.getParticipantId(), pt.getParticipantName()))
                        .collect(Collectors.toList()),
                service.getServicePrice(),
                service.getImageUrl(),
                isInUse // thêm vào đây
        );
    }

    // Nếu cần chuyển từ ServiceDTO (loại khác)
    public Service toEntity(ServiceDTO dto) {
        Double price = dto.getServicePrice();
        if (price == null) {
            throw new IllegalArgumentException("Giá dịch vụ không được để trống");
        }
        if (price <= 0) {
            throw new IllegalArgumentException("Giá dịch vụ phải lớn hơn 0");
        }
        if (serviceRepository.existsByServiceName(dto.getServiceName())) {
            throw new IllegalArgumentException("Tên dịch vụ đã tồn tại");
        }

        Service service = new Service();
        service.setServiceName(dto.getServiceName());
        service.setServiceDescription(dto.getServiceDescription());
        service.setServicePrice(price);

        return service;
    }
}
