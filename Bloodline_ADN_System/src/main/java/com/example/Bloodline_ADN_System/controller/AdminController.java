package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.CreateUserRequest;
import com.example.Bloodline_ADN_System.dto.UpdateServicePriceRequest;
import com.example.Bloodline_ADN_System.dto.UpdateServicePriceResponse;
import com.example.Bloodline_ADN_System.dto.accountResponse;
import com.example.Bloodline_ADN_System.service.impl.AdminServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminServiceImpl adminService;

    public AdminController(AdminServiceImpl adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        adminService.createUser(request);
        return ResponseEntity.ok("Tạo " + request.getRole() + " thành công");
    }

    @GetMapping("/alluser")
    public ResponseEntity<List<accountResponse>> getAllUser() {
        List<accountResponse> accountResponse = adminService.getAllUsers();
        System.out.println(accountResponse.size());
        return ResponseEntity.ok(accountResponse);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody accountResponse accountResponse) {
        adminService.updateUser(accountResponse);
        return ResponseEntity.ok("Cập nhật trạng thái thành công");
    }
    // Controller
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("Xóa người dùng thành công");
    }

    //update-price
    @PutMapping("/update-price")
    public ResponseEntity<UpdateServicePriceResponse> updateServicePrice(@RequestBody UpdateServicePriceRequest request) {
        UpdateServicePriceResponse response = adminService.updateServicePrice(request);
        return ResponseEntity.ok(response);
    }

}