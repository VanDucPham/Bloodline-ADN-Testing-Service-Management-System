package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.PaymentRequestDTO;
import com.example.Bloodline_ADN_System.dto.PaymentResponseDTO;
import com.example.Bloodline_ADN_System.Entity.Payment.PaymentStatus;
import com.example.Bloodline_ADN_System.Entity.Payment.PaymentMethod;
import com.example.Bloodline_ADN_System.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // Tạo mới thanh toán
    @PostMapping
    public PaymentResponseDTO createPayment(@RequestBody PaymentRequestDTO requestDTO) {
        return paymentService.createPayment(requestDTO);
    }

    // Lấy thông tin thanh toán theo appointment
    @GetMapping("/appointment/{appointmentId}")
    public PaymentResponseDTO getByAppointment(@PathVariable Long appointmentId) {
        return paymentService.getPaymentByAppointmentId(appointmentId);
    }

    // Cập nhật trạng thái thanh toán
    @PutMapping("/{paymentId}/status")
    public PaymentResponseDTO updateStatus(@PathVariable Long paymentId, @RequestParam PaymentStatus status) {
        return paymentService.updatePaymentStatus(paymentId, status);
    }

    // Lấy tất cả thanh toán (không phân trang)
    @GetMapping
    public List<PaymentResponseDTO> getAllPayments() {
        return paymentService.getAllPayments();
    }

    // Lấy tất cả thanh toán (có phân trang)
    @GetMapping("/paged")
    public Page<PaymentResponseDTO> getAllPayments(Pageable pageable) {
        return paymentService.getAllPayments(pageable);
    }

    // Lọc thanh toán theo trạng thái
    @GetMapping("/status")
    public List<PaymentResponseDTO> getByStatus(@RequestParam PaymentStatus status) {
        return paymentService.getPaymentsByStatus(status);
    }

    // Lọc thanh toán theo trạng thái + phương thức thanh toán
    @GetMapping("/filter")
    public List<PaymentResponseDTO> filterByStatusAndMethod(
            @RequestParam PaymentStatus status,
            @RequestParam PaymentMethod method) {
        return paymentService.getPaymentsByStatusAndMethod(status, method);
    }
}
