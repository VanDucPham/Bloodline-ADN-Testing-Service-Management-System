package com.example.Bloodline_ADN_System.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class OfflineRegisterRequestDTO {

    private Long userId; // ✅ Thêm dòng này để truyền ID người dùng đã có


    // Thông tin lịch hẹn
    private Long serviceId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String appointmentNote;

    // Danh sách người tham gia
    private List<ParticipantDTO> participants;

    @Data
    public static class ParticipantDTO {
        private String name;
        private String relationship;
        private String gender;
        private String citizenId;
        private String address;
        private LocalDate birthDate;

        // Thông tin mẫu xét nghiệm
        private String sampleType;
        private String sampleNote;
    }
}
