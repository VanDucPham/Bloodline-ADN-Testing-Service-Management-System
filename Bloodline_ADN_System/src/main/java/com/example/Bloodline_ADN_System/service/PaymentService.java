package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.dto.PaymentRequestDTO;
import com.example.Bloodline_ADN_System.dto.PaymentResponseDTO;
import com.example.Bloodline_ADN_System.Entity.Payment.PaymentStatus;
import com.example.Bloodline_ADN_System.Entity.Payment.PaymentMethod;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PaymentService {

    // Tạo thanh toán mới
    PaymentResponseDTO createPayment(PaymentRequestDTO paymentRequestDTO);

    // Lấy thông tin thanh toán theo appointment ID
    PaymentResponseDTO getPaymentByAppointmentId(Long appointmentId);

    // Cập nhật trạng thái thanh toán
    PaymentResponseDTO updatePaymentStatus(Long paymentId, PaymentStatus status);

    // Lấy tất cả thanh toán (không phân trang)
    List<PaymentResponseDTO> getAllPayments();

    // Lấy tất cả thanh toán (có phân trang)
    Page<PaymentResponseDTO> getAllPayments(Pageable pageable);

    // Lọc thanh toán theo trạng thái
    List<PaymentResponseDTO> getPaymentsByStatus(PaymentStatus status);

    // Lọc thanh toán theo trạng thái và phương thức
    List<PaymentResponseDTO> getPaymentsByStatusAndMethod(PaymentStatus status, PaymentMethod method);
}
