package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.BlogRequestDTO;
import com.example.Bloodline_ADN_System.dto.BlogResponseDTO;
import com.example.Bloodline_ADN_System.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    // ✅ Admin
    @PostMapping("/create")
    public ResponseEntity<BlogResponseDTO> create(@RequestBody BlogRequestDTO dto) {
        return ResponseEntity.ok(blogService.createBlog(dto));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<BlogResponseDTO> update(@PathVariable Long id, @RequestBody BlogRequestDTO dto) {
        return ResponseEntity.ok(blogService.updateBlog(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return ResponseEntity.ok("Xóa blog thành công");
    }

    @GetMapping("/all")
    public ResponseEntity<List<BlogResponseDTO>> getAll() {
        return ResponseEntity.ok(blogService.getAllBlogs());
    }

    @GetMapping("/search")
    public ResponseEntity<List<BlogResponseDTO>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(blogService.searchBlogs(keyword));
    }

 /*   // ✅ Người dùng
    @GetMapping("/public")
    public ResponseEntity<List<BlogResponseDTO>> getPublishedBlogs() {
        return ResponseEntity.ok(blogService.getPublishedBlogs());
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<BlogResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getBlogById(id));
    }*/
}
