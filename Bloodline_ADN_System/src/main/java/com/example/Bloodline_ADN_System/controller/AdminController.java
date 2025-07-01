package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.CreateUserRequest;
import com.example.Bloodline_ADN_System.dto.ServiceDTO;
import com.example.Bloodline_ADN_System.dto.accountResponse;
import com.example.Bloodline_ADN_System.dto.updateUserRequest;
import com.example.Bloodline_ADN_System.repository.UserRepository;
import com.example.Bloodline_ADN_System.service.ServiceList;
import com.example.Bloodline_ADN_System.service.impl.AdminServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {

    private final AdminServiceImpl adminService;
    private final UserRepository userRepository;
    private final ServiceList serviceList;


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

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,@RequestBody updateUserRequest request) {
        adminService.updateUser(id, request);
        System.out.println("Hello");
        return ResponseEntity.ok("Cập nhật trạng thái thành công");
    }
    // Controller
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("Xóa người dùng thành công");
    }
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailExists(@RequestParam String email) {
        boolean exists = userRepository.existsByEmail(email);
        System.out.println("có mail rồi");
        return ResponseEntity.ok(exists);
    }
    @PostMapping(
            path = "/import_user",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> importUser(@RequestParam("file") MultipartFile file) {
        try {
            adminService.importUserFromExcel(file);
            return ResponseEntity.ok("Import thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi import file: " + e.getMessage());
        }
    }

    @GetMapping("/service/get")
    public ResponseEntity<List<ServiceDTO>> getAllServices() {
        List<ServiceDTO> service = serviceList.getAllServices();
        return ResponseEntity.ok(service);
    }

    @GetMapping("/service/get/{id}")
    public ResponseEntity<ServiceDTO> getServiceById(@PathVariable Long id) {
        ServiceDTO service = serviceList.getServiceById(id);
        return ResponseEntity.ok(service);
    }

    @PostMapping("/service/add")
    public ResponseEntity<ServiceDTO> addService(@RequestBody ServiceDTO serviceDTO) {
        return ResponseEntity.ok(serviceList.createService(serviceDTO));
    }

    @PutMapping("/service/update/{id}")
    public ResponseEntity<ServiceDTO> updateService(@PathVariable Long id,@RequestBody ServiceDTO serviceDTO){
        return ResponseEntity.ok(serviceList.updateService(id,serviceDTO));
    }

    @DeleteMapping("service/delete/{id}")
    public ResponseEntity<String> deleteService(@PathVariable Long id) {
        serviceList.deleteService(id);
        return ResponseEntity.ok("Xóa dịch vụ thành công");
    }

}