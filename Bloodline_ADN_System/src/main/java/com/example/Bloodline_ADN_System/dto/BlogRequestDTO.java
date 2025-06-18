package com.example.Bloodline_ADN_System.dto;

import lombok.Data;


@Data
public class BlogRequestDTO {
    private String title;
    private String content;
    private String imageUrl;
    private String status; // DRAFT, PUBLISHED, ARCHIVED
    private Long authorId;
}
