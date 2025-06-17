package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.dto.PaymentRequestDTO;
import com.example.Bloodline_ADN_System.dto.PaymentResponseDTO;
import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.Entity.Payment;
import com.example.Bloodline_ADN_System.Entity.Payment.PaymentStatus;
import com.example.Bloodline_ADN_System.Entity.Payment.PaymentMethod;
import com.example.Bloodline_ADN_System.repository.AppointmentRepository;
import com.example.Bloodline_ADN_System.repository.PaymentRepository;
import com.example.Bloodline_ADN_System.service.PaymentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    // Inject các repository để làm việc với DB
    private final PaymentRepository paymentRepository;
    private final AppointmentRepository appointmentRepository;

    /**
     * Tạo một thanh toán mới cho cuộc hẹn.
     * Kiểm tra xem cuộc hẹn đã có thanh toán nào chưa,
     * nếu có thì không cho tạo mới nữa.
     */
    @Override
    public PaymentResponseDTO createPayment(PaymentRequestDTO dto) {
        Appointment appointment = appointmentRepository.findById(dto.getAppointmentId())
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found"));

        // Nếu appointment đã có thanh toán thì không cho tạo mới
        if (paymentRepository.findByAppointment_AppointmentId(dto.getAppointmentId()).isPresent()) {
            throw new IllegalArgumentException("This appointment already has a payment.");
        }

        // Tạo thực thể mới từ DTO
        Payment payment = toEntity(dto);
        payment.setAppointment(appointment); // liên kết với appointment
        payment.setStatus(PaymentStatus.PENDING); // mặc định trạng thái là PENDING

        // Lưu vào DB và trả kết quả dưới dạng DTO
        return toDTO(paymentRepository.save(payment));
    }

    /**
     * Lấy thanh toán theo ID của cuộc hẹn.
     */
    @Override
    public PaymentResponseDTO getPaymentByAppointmentId(Long appointmentId) {
        Payment payment = paymentRepository.findByAppointment_AppointmentId(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found for appointment ID: " + appointmentId));
        return toDTO(payment);
    }

    /**
     * Cập nhật trạng thái của thanh toán (ví dụ: từ PENDING sang SUCCESS).
     */
    @Override
    public PaymentResponseDTO updatePaymentStatus(Long paymentId, PaymentStatus status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found"));
        payment.setStatus(status);
        return toDTO(paymentRepository.save(payment));
    }

    /**
     * Trả về danh sách tất cả các thanh toán (không phân trang).
     */
    @Override
    public List<PaymentResponseDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Trả về danh sách tất cả các thanh toán theo phân trang.
     */
    @Override
    public Page<PaymentResponseDTO> getAllPayments(Pageable pageable) {
        return paymentRepository.findAll(pageable)
                .map(this::toDTO);
    }

    /**
     * Trả về danh sách thanh toán theo trạng thái cụ thể.
     */
    @Override
    public List<PaymentResponseDTO> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepository.findByStatus(status).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Trả về danh sách thanh toán theo trạng thái và phương thức thanh toán.
     */
    @Override
    public List<PaymentResponseDTO> getPaymentsByStatusAndMethod(PaymentStatus status, PaymentMethod method) {
        return paymentRepository.findByStatusAndPaymentMethod(status, method).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // =====================================
    // ====== Chuyển đổi DTO / Entity ======
    // =====================================

    /**
     * Chuyển DTO yêu cầu sang đối tượng Payment để lưu DB.
     */
    private Payment toEntity(PaymentRequestDTO dto) {
        Payment payment = new Payment();
        payment.setAmount(dto.getAmount());
        payment.setNotes(dto.getNotes());
        payment.setStatus(dto.getStatus()); // Sẽ bị ghi đè là PENDING
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setPaymentDate(LocalDateTime.now()); // Gán ngày thanh toán là hiện tại
        return payment;
    }

    /**
     * Chuyển Payment từ DB sang DTO để trả về client.
     */
    private PaymentResponseDTO toDTO(Payment payment) {
        PaymentResponseDTO dto = new PaymentResponseDTO();
        dto.setPaymentId(payment.getPaymentId());
        dto.setAppointmentId(payment.getAppointment().getAppointmentId());
        dto.setAmount(payment.getAmount());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setStatus(payment.getStatus());
        dto.setNotes(payment.getNotes());
        return dto;
    }
}
