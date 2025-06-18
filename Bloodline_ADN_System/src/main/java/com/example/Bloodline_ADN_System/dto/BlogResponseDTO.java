package com.example.Bloodline_ADN_System.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class BlogResponseDTO {
    private Long blogId;
    private String title;
    private String content;
    private String imageUrl;
    private String status;
    private String authorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}