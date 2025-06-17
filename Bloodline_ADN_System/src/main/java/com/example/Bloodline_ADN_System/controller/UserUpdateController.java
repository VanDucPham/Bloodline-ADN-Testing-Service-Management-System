package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.ChangePasswordDTO;
import com.example.Bloodline_ADN_System.dto.UserUpdateDTO;
import com.example.Bloodline_ADN_System.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserUpdateController {
    private final UserService userService;

    @PutMapping("/{id}")
    public ResponseEntity<UserUpdateDTO> updateUser(@PathVariable Long id, @RequestBody UserUpdateDTO updatedUser) {
        UserUpdateDTO response = userService.updateUser(id, updatedUser);
        return ResponseEntity.ok(response);
    }
    @PutMapping("/{id}/change-password")
    public ResponseEntity<String> changePassword(@PathVariable Long id, @RequestBody ChangePasswordDTO dto) {
        userService.changePassword(id, dto);
        return ResponseEntity.ok("Mật khẩu cập nhật thành công");
    }
}
