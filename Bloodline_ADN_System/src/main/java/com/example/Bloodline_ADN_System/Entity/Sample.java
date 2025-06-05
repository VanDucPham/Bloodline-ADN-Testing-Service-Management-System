package com.example.Bloodline_ADN_System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sample")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sample {
    @Id
    @GeneratedValue
    private int sample_id;
    @OneToOne
    @JoinColumn(name="participant_id", nullable = false)
    private Participant participant ;

    private String sample_type; // Loại mẫu (máu, nước tiểu, v.v.)
    private String collection_date; // Ngày thu thập mẫu
    private String collection_time; // Giờ thu thập mẫu
    private String quality; // Chất lượng mẫu (tốt, trung bình, kém)
    private String status; // Trạng thái mẫu (đã thu thập, đang xử lý, đã hoàn thành)
    private String notes; // Ghi chú thêm về mẫu
    @OneToOne(mappedBy = "sample")
    private Result result;



    // Các phương thức getter và setter có thể ��ược tạo tự động hoặc bằng tay
}