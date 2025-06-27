package com.example.Bloodline_ADN_System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

// ========================
// 👤 USER ENTITY
// ========================
@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long userId;

        @Column(unique = true, nullable = false)
        private String email;

        @Column(nullable = false)
        private String password;

        private String indentifiCard;
        private String name;
        private String gender;
        private String phone;
        private String address;

        @Enumerated(EnumType.STRING)
        private Status status;

        private LocalDate birthDate;

        @Enumerated(EnumType.STRING)
        private UserRole role;

        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        private List<Appointment> appointments = new ArrayList<>();

        @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        private List<Blog> blogs = new ArrayList<>();

        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        private List<Feedback> feedbacks = new ArrayList<>();

        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        private List<Notification> notifications = new ArrayList<>();

        public enum UserRole {
                ADMIN, CUSTOMER, STAFF, MANAGER
        }
        public void setRole(UserRole role) {
                this.role = UserRole.valueOf(role.toString());

        }
        public String getRole() {
                return this.role.toString();
        }
        public enum Status {
                ACTIVE, INACTIVE;


        }
        public void setStatusFromString(String status) {
                this.status = Status.valueOf(status.toUpperCase());
        }

        public String getStatusString() {
                return this.status != null ? this.status.toString() : null;
        }
}