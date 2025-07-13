package com.example.Bloodline_ADN_System.controller;


import com.example.Bloodline_ADN_System.dto.BlogDTO;
import com.example.Bloodline_ADN_System.dto.Login.LoginRequest;
import com.example.Bloodline_ADN_System.dto.Login.LoginResponse;
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
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthServiceImpl authService;
    private final BlogService blogService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse loginResponse = authService.login(loginRequest);
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

    // Public: Lấy thông tin user theo ID (chỉ hiển thị tên)
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        try {
            String userName = authService.getUserNameById(userId);
            return ResponseEntity.ok(Map.of("name", userName));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
