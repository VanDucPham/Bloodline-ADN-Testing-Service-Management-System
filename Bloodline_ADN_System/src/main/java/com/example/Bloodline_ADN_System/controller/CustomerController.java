package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.ChangePasswordDTO;
import com.example.Bloodline_ADN_System.dto.SampleDTO;
import com.example.Bloodline_ADN_System.dto.TrackingAppoint.AppointmentResponseDTO;
import com.example.Bloodline_ADN_System.dto.UserUpdateDTO;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.AppointmentDTO;
import com.example.Bloodline_ADN_System.service.AppointmentService;
import com.example.Bloodline_ADN_System.service.UserService;
import com.example.Bloodline_ADN_System.service.impl.AppointmentServiceImpl;
import com.example.Bloodline_ADN_System.service.impl.CustomerServiceImp;
import com.example.Bloodline_ADN_System.service.impl.SampleServiceImpl;
import com.example.Bloodline_ADN_System.service.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {
    private final UserService userService;
    private final UserServiceImpl userServiceImpl;
    private final AppointmentServiceImpl appointmentService;
    private final CustomerServiceImp customerServiceImp;
    private final SampleServiceImpl sampleServiceImpl;

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
    @GetMapping("/appointmentList")
    public ResponseEntity<?> getAppointmentList(Authentication authentication) {
        String email = authentication.getName(); // lấy email từ phiên đăng nhập
        Long userId = appointmentService.getUserIdByUsername(email); // lấy userId từ email
        List<AppointmentResponseDTO> appointments = customerServiceImp.getAllAppointments(userId);
        return ResponseEntity.ok(appointments);
    }
    @PutMapping("/updateSample")
    public ResponseEntity<?> updateSample(@RequestBody SampleDTO dto) {
            sampleServiceImpl.updateSample(dto);
        return ResponseEntity.ok("Sample updated successfully");
    }
}
