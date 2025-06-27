package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.ChangePasswordDTO;
import com.example.Bloodline_ADN_System.dto.UserUpdateDTO;
import com.example.Bloodline_ADN_System.service.UserService;
import com.example.Bloodline_ADN_System.service.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserServiceImpl userServiceImpl;
    @PutMapping
    public ResponseEntity<UserUpdateDTO> updateUser(Authentication authentication, @RequestBody UserUpdateDTO updatedUser) {
        String email = authentication.getName() ;
        UserUpdateDTO response = userServiceImpl.updateUser(email, updatedUser);
        System.out.println("Đã vào được"+ response.getBirthDate());

        return ResponseEntity.ok(response);
    }
    @PutMapping("/{id}/change-password")
    public ResponseEntity<String> changePassword(@PathVariable Long id, @RequestBody ChangePasswordDTO dto) {
        userService.changePassword(id, dto);
        return ResponseEntity.ok("Mật khẩu cập nhật thành công");
    }
    @GetMapping ("/Profile")
    public ResponseEntity<UserUpdateDTO> getProfile(Authentication authentication) {
        System.out.println("Vào đdudocwjcj roi");
        String email = authentication.getName();

        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

}
