package com.example.Bloodline_ADN.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Payment {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int payment_id; // Mã thanh toán

    @JoinColumn(name = "appointment_id", nullable = false)
    @OneToOne
    private Appointment appointment; // Mã cuộc hẹn liên kết với thanh toán
    private double amount; // Số tiền thanh toán
    private String payment_date; // Ngày thanh toán
    private String payment_method; // Phương thức thanh toán (ví dụ: thẻ tín dụng, chuyển khoản ngân hàng)
    private String status; // Trạng thái thanh toán (đã hoàn thành, đang xử lý, thất bại)
    private String notes; // Ghi chú thêm về thanh toán

    // Các phương thức getter và setter có thể được tạo tự động hoặc bằng tay
}
