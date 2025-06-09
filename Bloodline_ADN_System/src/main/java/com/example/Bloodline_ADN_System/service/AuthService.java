package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.dto.LoginRequest;
import com.example.Bloodline_ADN_System.dto.LoginResponse;
import com.example.Bloodline_ADN_System.dto.RegisterRequest;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    String RegisterUser(RegisterRequest registerRequest);
}
