package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.User;
import com.example.Bloodline_ADN_System.config.JwtService;
import com.example.Bloodline_ADN_System.dto.RegisterRequest;
import com.example.Bloodline_ADN_System.dto.LoginRequest;
import com.example.Bloodline_ADN_System.dto.LoginResponse;
import com.example.Bloodline_ADN_System.repository.UserRepository;
import com.example.Bloodline_ADN_System.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private JwtService jwtService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        if (!encoder.matches(request.getPassword(),user.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        String token = jwtService.generateToken(user);
        System.out.println();
        return new LoginResponse(token, "Đăng nhập thành công", user.getUserId(),user.getName(),  user.getRole(), user.getEmail());
    }

    @Override
    public String RegisterUser(RegisterRequest registerRequest) {
        if (userRepo.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exist");
        }
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(encoder.encode((registerRequest.getPassword())));
        user.setPhone(registerRequest.getPhone());
        user.setName(registerRequest.getFullName());
        // Convert role string to enum
        user.setRole(User.UserRole.valueOf("CUSTOMER"));
        user.setStatusFromString("ACTIVE");
        userRepo.save(user);
        return "Thành Công";
    }
}