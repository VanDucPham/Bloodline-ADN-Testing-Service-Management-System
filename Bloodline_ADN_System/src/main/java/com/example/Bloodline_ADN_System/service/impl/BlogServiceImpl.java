package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.Blog;
import com.example.Bloodline_ADN_System.Entity.User;
import com.example.Bloodline_ADN_System.dto.BlogRequestDTO;
import com.example.Bloodline_ADN_System.dto.BlogResponseDTO;
import com.example.Bloodline_ADN_System.repository.BlogRepository;
import com.example.Bloodline_ADN_System.repository.UserRepository;
import com.example.Bloodline_ADN_System.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    @Override
    public BlogResponseDTO createBlog(BlogRequestDTO dto) {
        User author = userRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new IllegalArgumentException("Tác giả không tồn tại"));

        Blog blog = new Blog();
        blog.setTitle(dto.getTitle());
        blog.setContent(dto.getContent());
        blog.setImageUrl(dto.getImageUrl());
        blog.setStatus(Blog.BlogStatus.valueOf(dto.getStatus().toUpperCase()));
        blog.setAuthor(author);
        blog = blogRepository.save(blog);
        return toDTO(blog);
    }

    @Override
    public BlogResponseDTO updateBlog(Long blogId, BlogRequestDTO dto) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new IllegalArgumentException("Blog không tồn tại"));

        blog.setTitle(dto.getTitle());
        blog.setContent(dto.getContent());
        blog.setImageUrl(dto.getImageUrl());
        blog.setStatus(Blog.BlogStatus.valueOf(dto.getStatus().toUpperCase()));
        return toDTO(blogRepository.save(blog));
    }

    @Override
    public void deleteBlog(Long blogId) {
        blogRepository.deleteById(blogId);
    }

    @Override
    public List<BlogResponseDTO> getAllBlogs() {
        return blogRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<BlogResponseDTO> searchBlogs(String keyword) {
        return blogRepository.searchByTitleOrAuthor(keyword).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public BlogResponseDTO getBlogById(Long blogId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new IllegalArgumentException("Blog không tồn tại"));
        return toDTO(blog);
    }

    @Override
    public List<BlogResponseDTO> getPublishedBlogs() {
        return blogRepository.findByStatus(Blog.BlogStatus.PUBLISHED)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private BlogResponseDTO toDTO(Blog blog) {
        return new BlogResponseDTO(
                blog.getBlogId(),
                blog.getTitle(),
                blog.getContent(),
                blog.getImageUrl(),
                blog.getStatus().name(),
                blog.getAuthor().getName(),
                blog.getCreatedAt(),
                blog.getUpdatedAt()
        );
    }
}