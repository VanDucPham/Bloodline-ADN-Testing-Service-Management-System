package com.example.Bloodline_ADN_System.dto;

import com.example.Bloodline_ADN_System.Entity.User;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserUpdateDTO {
    private Long userId;
    private String email;
    private String password;
    private String name;
    private String gender;
    private String phone;
    private String address;
    private LocalDate birthDate;
    private User.UserRole role;
}
