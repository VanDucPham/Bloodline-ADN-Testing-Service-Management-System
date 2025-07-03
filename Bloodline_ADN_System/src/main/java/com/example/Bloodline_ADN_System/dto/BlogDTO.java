package com.example.Bloodline_ADN_System.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BlogDTO {
    private Long blogId;
    private Long authorId; // chỉ lấy id hoặc có thể lấy tên tác giả nếu muốn
    private String title;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status; // DRAFT, PUBLISHED, ARCHIVED
}