package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Lấy tất cả các thanh toán theo trạng thái
    List<Payment> findByStatus(Payment.PaymentStatus status);

    // Lấy thanh toán theo trạng thái và khoảng thời gian
    List<Payment> findByStatusAndPaymentDateBetween(Payment.PaymentStatus status, LocalDateTime start, LocalDateTime end);
}