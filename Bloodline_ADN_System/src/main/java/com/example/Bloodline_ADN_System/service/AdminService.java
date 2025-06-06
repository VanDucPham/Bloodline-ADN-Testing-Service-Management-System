package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.Entity.User;
import com.example.Bloodline_ADN_System.dto.CreateUserRequest;
import com.example.Bloodline_ADN_System.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public AdminService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
       this.passwordEncoder = passwordEncoder;
    }

    public void createUser(CreateUserRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getFullName());
        user.setRole(request.getRole().toUpperCase(Locale.ROOT));

        userRepository.save(user);
    }
}

