package com.example.Bloodline_ADN_System.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class CustomerProfileDTO {

    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String gender;
    private LocalDate birthDate;
    private String address;

    // ✅ Dùng AppointmentDTO từ file riêng
    private List<AppointmentDTO> appointments;
}
