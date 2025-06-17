package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.User;
import com.example.Bloodline_ADN_System.dto.ChangePasswordDTO;
import com.example.Bloodline_ADN_System.dto.UserUpdateDTO;
import com.example.Bloodline_ADN_System.repository.UserRepository;
import com.example.Bloodline_ADN_System.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    //Customer update profile
    @Override
    public UserUpdateDTO updateUser(Long id, UserUpdateDTO updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        if (updatedUser.getName() != null) {
            user.setName(updatedUser.getName());
        }
        if (updatedUser.getGender() != null) {
            user.setGender(updatedUser.getGender());
        }
        if (updatedUser.getPhone() != null) {
            user.setPhone(updatedUser.getPhone());
        }
        if (updatedUser.getAddress() != null) {
            user.setAddress(updatedUser.getAddress());
        }
        if (updatedUser.getBirthDate() != null) {
            user.setBirthDate(updatedUser.getBirthDate());
        }
        if (updatedUser.getEmail() != null) {
            user.setEmail(updatedUser.getEmail());
        }
        // Không set lại role, giữ nguyên role gốc của user

        User saved = userRepository.save(user);
        return toDTO(saved);
    }

    //Đổi mật khẩu
    public void changePassword(Long userId, ChangePasswordDTO changPasswordDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        if (!passwordEncoder.matches(changPasswordDTO.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu hiện tại không đúng");
        }


        user.setPassword(passwordEncoder.encode(changPasswordDTO.getNewPassword()));
        userRepository.save(user);
    }
    private UserUpdateDTO toDTO(User user) {
        UserUpdateDTO response = new UserUpdateDTO();
        response.setName(user.getName());
        response.setGender(user.getGender());
        response.setPhone(user.getPhone());
        response.setAddress(user.getAddress());
        response.setBirthDate(user.getBirthDate());
        response.setEmail(user.getEmail());
        return response;
    }

}
