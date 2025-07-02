package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.Entity.User;
import com.example.Bloodline_ADN_System.dto.BlogDTO;

import java.util.List;
import java.util.Optional;

public interface BlogService {
    List<BlogDTO> getAllBlogDTO();
    Optional<BlogDTO> getBlogById(Long id);
    BlogDTO createBlog(BlogDTO dto);
    BlogDTO updateBlog(Long id, BlogDTO dto);
    void deleteBlog(Long id);
}