package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.dto.ChangePasswordDTO;
import com.example.Bloodline_ADN_System.dto.UserUpdateDTO;

public interface UserService {
    UserUpdateDTO updateUser(Long id, UserUpdateDTO updatedUser);
    void changePassword(Long userId, ChangePasswordDTO changPasswordDTO);
}
