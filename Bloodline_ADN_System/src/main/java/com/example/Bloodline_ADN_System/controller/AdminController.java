package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.CreateUserRequest;
import com.example.Bloodline_ADN_System.service.AdminService;
import com.example.Bloodline_ADN_System.service.impl.AdminServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminServiceImpl adminService;

    public AdminController(AdminServiceImpl adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/user")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {

        // DEBUG: Kiểm tra authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("=== ADMIN CONTROLLER DEBUG ===");
        System.out.println("Principal: " + auth.getPrincipal());
        System.out.println("Authorities: " + auth.getAuthorities());
        System.out.println("Name: " + auth.getName());

        // Kiểm tra có authority ROLE_ADMIN không
        boolean hasAdminRole = auth.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        System.out.println("Has ROLE_ADMIN: " + hasAdminRole);

        adminService.createUser(request);
        return ResponseEntity.ok("Tạo "+ request.getRole() + " thành công");
    }
}
