package com.example.Bloodline_ADN_System.service;



import com.example.Bloodline_ADN_System.Entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

// service/AuthService.java
@Service
public class AuthService {
    @Autowired
    private com.example.Bloodline_ADN_System.repository.UserRepository userRepo;

    public com.example.Bloodline_ADN_System.dto.LoginResponse login(com.example.Bloodline_ADN_System.dto.LoginRequest request) {
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        // Giả sử return 1 token tạm
        String fakeToken = UUID.randomUUID().toString();

        return new com.example.Bloodline_ADN_System.dto.LoginResponse(fakeToken, "Đăng nhập thành công");
    }
}

