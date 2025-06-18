package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.dto.BlogRequestDTO;
import com.example.Bloodline_ADN_System.dto.BlogResponseDTO;

import java.util.List;

public interface BlogService {
    BlogResponseDTO createBlog(BlogRequestDTO dto);
    BlogResponseDTO updateBlog(Long blogId, BlogRequestDTO dto);
    void deleteBlog(Long blogId);
    List<BlogResponseDTO> getAllBlogs();
    List<BlogResponseDTO> searchBlogs(String keyword);
    BlogResponseDTO getBlogById(Long blogId);
    List<BlogResponseDTO> getPublishedBlogs();
}
