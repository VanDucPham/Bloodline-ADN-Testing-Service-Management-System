package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.BlogDTO;
import com.example.Bloodline_ADN_System.service.BlogService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/blog")
@AllArgsConstructor
public class BlogController {
    private final BlogService blogService;

    // Lấy tất cả blog đã xuất bản
    @GetMapping("/all")
    public List<BlogDTO> getAllPublishedBlogs() {
        return blogService.getAllBlogDTO().stream()
                .filter(b -> "PUBLISHED".equals(b.getStatus()))
                .toList();
    }

    // Lấy các blog liên quan (ĐẶT TRƯỚC endpoint /{id} để tránh mapping nhầm)
    @GetMapping("/related")
    public ResponseEntity<?> getRelatedBlogs(
        @RequestParam Long blogId,
        @RequestParam(defaultValue = "4") int limit
    ) {
        return ResponseEntity.ok(blogService.getRelatedBlogs(blogId, limit));
    }

    // Lấy chi tiết blog đã xuất bản
    @GetMapping("/{id}")
    public ResponseEntity<?> getPublishedBlogById(@PathVariable Long id) {
        Optional<BlogDTO> blogOpt = blogService.getBlogById(id);
        if (blogOpt.isPresent() && "PUBLISHED".equals(blogOpt.get().getStatus())) {
            return ResponseEntity.ok(blogOpt.get());
        } else {
            return ResponseEntity.status(404).body("Blog không tồn tại hoặc chưa được xuất bản");
        }
    }

    // Phân trang blog đã xuất bản
    @GetMapping("/page")
    public ResponseEntity<?> getPublishedBlogsPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<BlogDTO> all = blogService.getBlogsPage(pageable, "PUBLISHED", null, null);
        return ResponseEntity.ok(all);
    }
} 