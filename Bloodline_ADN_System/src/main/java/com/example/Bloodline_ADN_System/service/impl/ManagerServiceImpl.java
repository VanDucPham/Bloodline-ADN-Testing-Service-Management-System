// ✅ Triển khai logic xử lý cho các chức năng quản lý (Manager)
package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.*;
import com.example.Bloodline_ADN_System.dto.*;
import com.example.Bloodline_ADN_System.repository.*;
import com.example.Bloodline_ADN_System.service.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

@Service // Đánh dấu đây là service để Spring quản lý
public class ManagerServiceImpl implements ManagerService {

    // Inject các repository phục vụ nghiệp vụ
    @Autowired private ManagerRepository managerRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private AppointmentRepository appointmentRepository;

    // ✅ Lấy toàn bộ danh sách nhân viên dưới dạng DTO
    public List<StaffDTO> getAllStaff() {
        return managerRepository.findByRole(User.UserRole.STAFF)
                .stream()
                .map(this::mapToStaffDTO) // chuyển từ User entity -> StaffDTO
                .collect(Collectors.toList());
    }

    // 🔍 Tìm kiếm nhân viên theo tên, email hoặc số điện thoại
    public List<StaffDTO> searchStaff(String keyword) {
        Set<User> result = new HashSet<>();
        // Tìm theo tên (không phân biệt hoa thường)
        result.addAll(managerRepository.findByRoleAndNameContainingIgnoreCase(User.UserRole.STAFF, keyword));
        // Tìm theo email
        result.addAll(managerRepository.findByRoleAndEmailContainingIgnoreCase(User.UserRole.STAFF, keyword));
        // Tìm theo số điện thoại
        result.addAll(managerRepository.findByRoleAndPhoneContaining(User.UserRole.STAFF, keyword));
        // Trả về danh sách đã loại trùng và chuyển sang DTO
        return result.stream().map(this::mapToStaffDTO).collect(Collectors.toList());
    }

    // ⛔ Vô hiệu hóa nhân viên (chuyển status sang INACTIVE)
    public void deactivateStaff(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() != User.UserRole.STAFF)
            throw new RuntimeException("User is not a staff");
        user.setStatus(User.Status.INACTIVE); // cập nhật trạng thái
        userRepository.save(user);
    }

    // 💰 Tính tổng doanh thu trong một tháng cụ thể
    public RevenueResponse getRevenueByMonth(int month, int year) {
        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime end = start.plusMonths(1);
        // Lọc danh sách thanh toán hoàn tất trong khoảng thời gian đó
        List<Payment> payments = paymentRepository.findByStatusAndPaymentDateBetween(
                Payment.PaymentStatus.COMPLETED, start, end
        );
        // Tính tổng tiền
        double total = payments.stream().mapToDouble(Payment::getAmount).sum();
        return new RevenueResponse(total, "Tháng " + month + "/" + year);
    }

    // 💵 Tính tổng doanh thu trong cả một năm
    public RevenueResponse getRevenueByYear(int year) {
        LocalDateTime start = LocalDateTime.of(year, Month.JANUARY, 1, 0, 0);
        LocalDateTime end = start.plusYears(1);
        List<Payment> payments = paymentRepository.findByStatusAndPaymentDateBetween(
                Payment.PaymentStatus.COMPLETED, start, end
        );
        double total = payments.stream().mapToDouble(Payment::getAmount).sum();
        return new RevenueResponse(total, "Năm " + year);
    }

    // 📥 Trả về danh sách các giao dịch đã thanh toán
    public List<PaymentDTO> getAllCompletedPayments() {
        return paymentRepository.findByStatus(Payment.PaymentStatus.COMPLETED)
                .stream()
                .map(this::mapToPaymentDTO) // chuyển từ entity -> DTO
                .collect(Collectors.toList());
    }

    // 📊 Thống kê top dịch vụ được sử dụng nhiều nhất
    public List<ServiceUsageDTO> getTopUsedServices() {
        // Lấy danh sách các lịch hẹn đã hoàn tất
        List<Appointment> appointments = appointmentRepository.findByStatus(Appointment.AppointmentStatus.COMPLETED);

        // Nhóm theo tên dịch vụ và đếm số lần sử dụng
        Map<String, Long> serviceCount = appointments.stream()
                .filter(a -> a.getService() != null) // loại bỏ lịch hẹn không có dịch vụ
                .collect(Collectors.groupingBy(
                        a -> a.getService().getServiceName(),
                        Collectors.counting()
                ));

        // Sắp xếp giảm dần theo số lượt sử dụng và trả về DTO
        return serviceCount.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(entry -> new ServiceUsageDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    // 🔁 Hàm hỗ trợ chuyển đổi từ User -> StaffDTO
    private StaffDTO mapToStaffDTO(User user) {
        return new StaffDTO(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getGender(),
                user.getAddress(),
                user.getStatusString()
        );
    }

    // 🔁 Hàm hỗ trợ chuyển đổi từ Payment -> PaymentDTO
    private PaymentDTO mapToPaymentDTO(Payment payment) {
        return new PaymentDTO(
                payment.getPaymentId(),
                payment.getAppointment().getUser().getName(),
                payment.getAmount(),
                payment.getPaymentMethod().toString(),
                payment.getPaymentDate(),
                payment.getNotes()
        );
    }
}
