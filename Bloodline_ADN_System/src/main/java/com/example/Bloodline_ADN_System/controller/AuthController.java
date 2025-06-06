package com.example.Bloodline_ADN_System.controller;


import com.example.Bloodline_ADN_System.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<com.example.Bloodline_ADN_System.dto.LoginResponse> login(@RequestBody com.example.Bloodline_ADN_System.dto.LoginRequest loginRequest) {
        com.example.Bloodline_ADN_System.dto.LoginResponse loginResponse = authService.login(loginRequest);
        return ResponseEntity.ok(loginResponse);
    }




}
