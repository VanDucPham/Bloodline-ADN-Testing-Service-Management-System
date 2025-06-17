package com.example.Bloodline_ADN_System.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String message ;
    private String fullName ;
    private String role ;
    private String email ;
    public LoginResponse(String token, String message, String fullName, String role, String email) {
        this.token = token;
        this.message = message;
        this.fullName = fullName;
        this.role = role;
        this.email = email;
    }
}
