package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    @Query("SELECT b FROM Blog b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(b.author.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Blog> searchByTitleOrAuthor(@Param("keyword") String keyword);

    List<Blog> findByStatus(Blog.BlogStatus status);
}
