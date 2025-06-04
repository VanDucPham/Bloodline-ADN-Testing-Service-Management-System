package com.example.Bloodline_ADN.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "blog")
@NoArgsConstructor
@AllArgsConstructor
@Data

public class Blog {
    @Id @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int blog_id; // Mã bài viết
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User author; // Mã người dùng liên kết với bài viết
    private String title; // Tiêu đề bài viết
    private String content; // Nội dung bài viết
    private String image_url; // URL hình ảnh đại diện của bài viết
    private String created_at; // Ngày tạo bài viết
    private String updated_at; // Ngày cập nhật bài viết

    // Các phương thức getter và setter có thể được tạo tự động hoặc bằng tay
}
