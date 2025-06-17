package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.Payment;
import com.example.Bloodline_ADN_System.Entity.Payment.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Tìm thanh toán của một cuộc hẹn
    Optional<Payment> findByAppointment_AppointmentId(Long appointmentId);

    // Lọc danh sách theo trạng thái
    List<Payment> findByStatus(PaymentStatus status);

    // Lọc theo trạng thái và phương thức thanh toán
    List<Payment> findByStatusAndPaymentMethod(PaymentStatus status, Payment.PaymentMethod method);
}
