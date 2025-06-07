package com.example.Bloodline_ADN_System.service;



import com.example.Bloodline_ADN_System.Entity.User;
import com.example.Bloodline_ADN_System.config.JwtService;
import com.example.Bloodline_ADN_System.dto.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

// service/AuthService.java
@Service
public class AuthService {
    @Autowired
    private com.example.Bloodline_ADN_System.repository.UserRepository userRepo;
    @Autowired
    private JwtService jwtService;
    public com.example.Bloodline_ADN_System.dto.LoginResponse login(com.example.Bloodline_ADN_System.dto.LoginRequest request) {
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        String token = jwtService.generateToken(user);

        return new com.example.Bloodline_ADN_System.dto.LoginResponse( token,"Đăng nhập thành công");
    }

    public String RegisterUser(RegisterRequest registerRequest) {
        if (userRepo.existsByEmail(registerRequest.getEmail())){
            throw new RuntimeException("Email already exist");
        }
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        user.setPhone(registerRequest.getPhone());
        user.setName(registerRequest.getFullName());
        user.setRoleFromString("CUSTOMER");
        userRepo.save(user);
        return "Thành Công" ;
    }
}

