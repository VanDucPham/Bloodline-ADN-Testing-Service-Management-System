// ✅ Đây là controller phục vụ cho chức năng của Manager/Admin
package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.*; // import các DTO dùng cho phản hồi/request
import com.example.Bloodline_ADN_System.service.ManagerService; // service xử lý nghiệp vụ Manager
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Đánh dấu class này là REST controller
@RequestMapping("/api/admin") // Prefix URL chung cho tất cả API bên dưới
public class ManagerController {

    // Tiêm service xử lý logic cho Manager
    @Autowired
    private ManagerService managerService;

    // ✅ [GET] Trả về toàn bộ danh sách nhân viên
    @GetMapping("/staff")
    public List<StaffDTO> getAllStaff() {
        return managerService.getAllStaff(); // gọi service để lấy danh sách StaffDTO
    }

    // 🔍 [GET] Tìm kiếm nhân viên theo từ khóa (tên/email/số điện thoại)
    @GetMapping("/staff/search")
    public List<StaffDTO> searchStaff(@RequestParam String keyword) {
        return managerService.searchStaff(keyword);
    }

    // ⛔ [PUT] Vô hiệu hóa một nhân viên dựa trên userId
    @PutMapping("/staff/deactivate/{id}")
    public void deactivateStaff(@PathVariable Long id) {
        managerService.deactivateStaff(id);
    }

    // 💰 [GET] Lấy doanh thu theo tháng/năm
    @GetMapping("/revenue/monthly")
    public RevenueResponse getMonthlyRevenue(@RequestParam int month, @RequestParam int year) {
        return managerService.getRevenueByMonth(month, year); // gọi service để tính doanh thu
    }

    // 💵 [GET] Lấy doanh thu theo năm
    @GetMapping("/revenue/yearly")
    public RevenueResponse getYearlyRevenue(@RequestParam int year) {
        return managerService.getRevenueByYear(year);
    }

    // 📥 [GET] Lấy danh sách các giao dịch đã thanh toán (COMPLETED)
    @GetMapping("/payments")
    public List<PaymentDTO> getCompletedPayments() {
        return managerService.getAllCompletedPayments();
    }

    // 📊 [GET] Trả về danh sách dịch vụ được dùng nhiều nhất
    @GetMapping("/services/top-used")
    public List<ServiceUsageDTO> getTopUsedServices() {
        return managerService.getTopUsedServices();
    }
}
