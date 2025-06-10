package com.example.Bloodline_ADN_System.controller;


import com.example.Bloodline_ADN_System.dto.RegisterRequest;
import com.example.Bloodline_ADN_System.service.AuthService;
import com.example.Bloodline_ADN_System.service.impl.AuthServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthServiceImpl authService;

    @Autowired
    public AuthController(AuthServiceImpl authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<com.example.Bloodline_ADN_System.dto.LoginResponse> login(@RequestBody com.example.Bloodline_ADN_System.dto.LoginRequest loginRequest) {
        com.example.Bloodline_ADN_System.dto.LoginResponse loginResponse = authService.login(loginRequest);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authService.RegisterUser(registerRequest));
    }

    @PostMapping("/logout")
    public void logout() {
        SecurityContextHolder.clearContext();
    }





}
