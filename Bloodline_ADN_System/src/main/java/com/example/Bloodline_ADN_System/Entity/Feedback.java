package com.example.Bloodline_ADN_System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@Table(name="feedback")
@AllArgsConstructor
@NoArgsConstructor
public class Feedback {
        @Id
        @GeneratedValue
        private int feedback_id; // Mã phản hồi
        @ManyToOne
        @JoinColumn(name = "user_id", nullable = false)
        private User user; // Mã người dùng liên kết với phản hồi
        @ManyToOne
        private Service service; // Mã dịch vụ liên kết với phản hồi
        private String feedback_text; // Nội dung phản hồi
        private String feedback_date; // Ngày gửi phản hồi



        // Các phương thức getter và setter có thể được tạo tự động hoặc bằng tay

}
