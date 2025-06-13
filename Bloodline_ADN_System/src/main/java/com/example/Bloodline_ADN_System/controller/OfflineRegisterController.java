package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.Entity.Payment;
import com.example.Bloodline_ADN_System.Entity.User;
import com.example.Bloodline_ADN_System.dto.AppointmentDTO;
import com.example.Bloodline_ADN_System.dto.ParticipantDTO;
import com.example.Bloodline_ADN_System.dto.CustomerProfileDTO;
import com.example.Bloodline_ADN_System.dto.OfflineRegisterRequestDTO;
import com.example.Bloodline_ADN_System.repository.PaymentRepository;
import com.example.Bloodline_ADN_System.repository.UserRepository;
import com.example.Bloodline_ADN_System.service.OfflineRegisterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class OfflineRegisterController {

    private final OfflineRegisterService offlineRegisterService;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    // ✅ 1. Tạo hồ sơ khách hàng tại cơ sở
    @PostMapping("/offline-register")
    public ResponseEntity<String> registerCustomerOffline(@RequestBody OfflineRegisterRequestDTO dto) {
        try {
            offlineRegisterService.createOfflineRegister(dto);
            return ResponseEntity.ok("Tạo hồ sơ khách hàng tại cơ sở thành công.");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body("Lỗi: " + ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body("Lỗi hệ thống: " + ex.getMessage());
        }
    }

    // ✅ 2. Xem hồ sơ theo userId
    @GetMapping("/customers/{userId}/profile")
    public ResponseEntity<CustomerProfileDTO> getCustomerProfileById(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng."));
        return ResponseEntity.ok(buildCustomerProfile(user));
    }

    // ✅ 3. Xem hồ sơ theo email
    @GetMapping("/customers/profile-by-email")
    public ResponseEntity<CustomerProfileDTO> getCustomerProfileByEmail(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng."));
        return ResponseEntity.ok(buildCustomerProfile(user));
    }

    // ✅ 4. Lấy danh sách tất cả khách hàng
    @GetMapping("/customers")
    public ResponseEntity<List<CustomerProfileDTO>> getAllCustomerProfiles() {
        List<CustomerProfileDTO> customers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.UserRole.CUSTOMER)
                .map(this::buildCustomerProfile)
                .toList();
        return ResponseEntity.ok(customers);
    }

    // ✅ 5. Helper để build DTO
    private CustomerProfileDTO buildCustomerProfile(User user) {
        List<AppointmentDTO> appointmentDTOs = user.getAppointments().stream().map(appt -> {
            String resultSummary = (appt.getResult() != null)
                    ? appt.getResult().getResultValue()
                    : "Chưa có kết quả";

            Optional<Payment> optionalPayment = paymentRepository.findByAppointment_AppointmentId(appt.getAppointmentId());
            String paymentStatus = optionalPayment.map(p -> p.getStatus().name()).orElse("CHƯA CÓ");
            String paymentMethod = optionalPayment.map(p -> p.getPaymentMethod().name()).orElse("-");
            Double amount = optionalPayment.map(Payment::getAmount).orElse(null);
            LocalDateTime paymentDate = optionalPayment.map(Payment::getPaymentDate).orElse(null);
            String paymentNote = optionalPayment.map(Payment::getNotes).orElse(null);

            List<ParticipantDTO> participantDTOs = appt.getParticipants().stream().map(p -> {
                String sampleStatus = (p.getSample() != null && p.getSample().getStatus() != null)
                        ? p.getSample().getStatus().name()
                        : "CHƯA CÓ";
                return new ParticipantDTO(
                        p.getName(),
                        p.getRelationship(),
                        p.getCitizenId(),
                        p.getGender().name(),
                        p.getBirthDate(),
                        p.getAddress(),
                        sampleStatus
                );
            }).toList();

            return new AppointmentDTO(
                    appt.getAppointmentId(),
                    appt.getAppointmentDate(),
                    appt.getAppointmentTime(),
                    appt.getAppointmentNote(),
                    appt.getStatus().name(),
                    (appt.getService() != null) ? appt.getService().getServiceName() : "CHƯA CHỌN",
                    resultSummary,
                    participantDTOs,
                    paymentStatus,
                    paymentMethod,
                    amount,
                    paymentDate,
                    paymentNote
            );
        }).toList();

        return new CustomerProfileDTO(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getGender(),
                user.getBirthDate(),
                user.getAddress(),
                appointmentDTOs
        );
    }

    // ✅ 6. Xác nhận thanh toán offline
    @PutMapping("/confirm-offline")
    public ResponseEntity<String> confirmOfflinePayment(@RequestParam Long appointmentId) {
        Payment payment = paymentRepository.findByAppointment_AppointmentId(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thanh toán"));

        if (payment.getPaymentMethod() != Payment.PaymentMethod.CASH) {
            return ResponseEntity.badRequest().body("Chỉ xác nhận được với phương thức thanh toán tiền mặt.");
        }

        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        paymentRepository.save(payment);

        return ResponseEntity.ok("Xác nhận đã thu tiền thành công.");
    }

    // ✅ 7. Kiểm tra trạng thái thanh toán
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Long appointmentId) {
        Payment payment = paymentRepository.findByAppointment_AppointmentId(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Chưa có thông tin thanh toán"));

        return ResponseEntity.ok(Map.of(
                "appointmentId", appointmentId,
                "status", payment.getStatus(),
                "method", payment.getPaymentMethod(),
                "amount", payment.getAmount(),
                "paymentDate", payment.getPaymentDate()
        ));
    }
}
