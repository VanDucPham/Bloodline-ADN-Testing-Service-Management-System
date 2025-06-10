package com.example.Bloodline_ADN_System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Feedback {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "feedback_id")
        private Long feedbackId;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "service_id")
        private Service service;

        @Column(name = "feedback_text", columnDefinition = "TEXT")
        private String feedbackText;

        @Column(name = "feedback_date")
        private LocalDateTime feedbackDate;

        @Column(name = "rating")
        private Integer rating; // 1-5 stars

        @OneToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "appointment_id")
        private Appointment appointment;

        @PrePersist
        protected void onCreate() {
                feedbackDate = LocalDateTime.now();
        }
}