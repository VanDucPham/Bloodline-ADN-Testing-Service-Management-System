package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ManagerRepository extends JpaRepository<User, Long> {

    // Tìm tất cả người dùng có role là STAFF
    List<User> findByRole(User.UserRole role);

    // Tìm nhân viên theo tên
    List<User> findByRoleAndNameContainingIgnoreCase(User.UserRole role, String name);

    // Tìm nhân viên theo email
    List<User> findByRoleAndEmailContainingIgnoreCase(User.UserRole role, String email);

    // Tìm nhân viên theo số điện thoại
    List<User> findByRoleAndPhoneContaining(User.UserRole role, String phone);
}