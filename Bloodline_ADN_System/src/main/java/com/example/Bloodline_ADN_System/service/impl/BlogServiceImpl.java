package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.Blog;
import com.example.Bloodline_ADN_System.Entity.User;
import com.example.Bloodline_ADN_System.dto.BlogDTO;
import com.example.Bloodline_ADN_System.repository.BlogRepository;
import com.example.Bloodline_ADN_System.repository.UserRepository;
import com.example.Bloodline_ADN_System.service.BlogService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class BlogServiceImpl implements BlogService {
    @Autowired
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    // Lấy tất cả blog, trả về DTO
    public List<BlogDTO> getAllBlogDTO() {
        return blogRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // Lấy blog theo id, trả về DTO
    public Optional<BlogDTO> getBlogById(Long id) {
        return blogRepository.findById(id)
                .map(this::toDTO);
    }

    //Xóa blog
    @Override
    public void deleteBlog(Long id) {
        blogRepository.deleteById(id);
    }

    // Tạo mới blog từ DTO
    public BlogDTO createBlog(BlogDTO dto) {
        User author = userRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Blog blog = toEntity(dto, author);
        Blog saved = blogRepository.save(blog);
        return toDTO(saved);
    }

    // Cập nhật blog từ DTO
    public BlogDTO updateBlog(Long id, BlogDTO dto) {
        User author = userRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Blog blog = toEntity(dto, author);
        blog.setBlogId(id);
        Blog updated = blogRepository.save(blog);
        return toDTO(updated);
    }

    public BlogDTO toDTO(Blog blog) {
        BlogDTO dto = new BlogDTO();
        dto.setBlogId(blog.getBlogId());
        if (blog.getAuthor() != null) {
            dto.setAuthorId(blog.getAuthor().getUserId());
        }
        dto.setTitle(blog.getTitle());
        dto.setContent(blog.getContent());
        dto.setImageUrl(blog.getImageUrl());
        dto.setCreatedAt(blog.getCreatedAt());

        dto.setStatus(blog.getStatus() != null ? blog.getStatus().name() : null);
        return dto;
    }

    public Blog toEntity(BlogDTO dto, User author) {
        Blog blog = new Blog();
        blog.setBlogId(dto.getBlogId());
        blog.setAuthor(author); // author phải lấy từ DB theo authorId
        blog.setTitle(dto.getTitle());
        blog.setContent(dto.getContent());
        blog.setImageUrl(dto.getImageUrl());
        blog.setCreatedAt(dto.getCreatedAt());

        blog.setStatus(dto.getStatus() != null ? Blog.BlogStatus.valueOf(dto.getStatus()) : null);
        return blog;
    }
}