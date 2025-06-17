package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.User;
import com.example.Bloodline_ADN_System.dto.CreateUserRequest;
import com.example.Bloodline_ADN_System.dto.accountResponse;
import com.example.Bloodline_ADN_System.dto.updateUserRequest;
import com.example.Bloodline_ADN_System.repository.UserRepository;
import com.example.Bloodline_ADN_System.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void createUser(CreateUserRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại");
        }
        System.out.println(request.getName());
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode("123456"));
        user.setName(request.getName());

        user.setRole(User.UserRole.valueOf(request.getRole()));
        user.setStatusFromString("ACTIVE");

        userRepository.save(user);
        System.out.println("thêm thành cônh");
        System.out.println(user.getName());

    }

    @Override
    public List<accountResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new accountResponse(u.getUserId(),u.getName(), u.getEmail(), u.getRoleString(), u.getStatusString()))
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public void updateUser(Long id, updateUserRequest request) {
        User user = userRepository.findById(id).orElseThrow();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRoleFromString(request.getRole());
        user.setStatusFromString(request.getStatus());
        userRepository.save(user);
    }







    @Override
    public void deleteUser(Long id) {
         userRepository.deleteById(id);
    }
}