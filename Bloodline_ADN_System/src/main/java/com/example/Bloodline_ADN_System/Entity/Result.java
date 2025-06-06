package com.example.Bloodline_ADN_System.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="result")
public class Result {
    @Id
    @GeneratedValue
    private int result_id; // Mã kết quả

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "sample_id", nullable = false)
    private Sample sample; // Mã mẫu liên kết với kết quả
    private String test_type; // Loại xét nghiệm (ví dụ: ADN, huyết học, v.v.)
    private String result_value; // Giá trị kết quả (có thể là số, văn bản, v.v.)
    private String result_date; // Ngày trả kết quả
    private String status; // Trạng thái kết quả (đã hoàn thành, đang xử lý, v.v.)
    private String notes; // Ghi chú thêm về kết quả

    // Các phương thức getter và setter có thể được tạo tự động hoặc bằng tay
}