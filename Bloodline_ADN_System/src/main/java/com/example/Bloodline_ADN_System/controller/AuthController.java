package com.example.Bloodline_ADN_System.controller;


import com.example.Bloodline_ADN_System.dto.BlogDTO;
import com.example.Bloodline_ADN_System.dto.RegisterRequest;
import com.example.Bloodline_ADN_System.service.AuthService;
import com.example.Bloodline_ADN_System.service.BlogService;
import com.example.Bloodline_ADN_System.service.impl.AuthServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthServiceImpl authService;
    public final BlogService blogService;


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

    @GetMapping("/blog")
    public List<BlogDTO> getAllBlogs() {
        return blogService.getAllBlogDTO();
    }





}
