package com.example.Bloodline_ADN_System.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    private Long appointmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private Service service;

    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Participant> participants = new ArrayList<>();

    @OneToOne(mappedBy = "appointment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Payment payment;

    @Enumerated(EnumType.STRING)
    @Column(name = "appointment_type")
    private AppointmentType type;

    @Column(name = "created_time")
    private LocalDateTime createdTime;

    @Column(name = "appointment_date")
    private LocalDate appointmentDate;

    @Column(name = "appointment_time")
    private LocalTime appointmentTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "appointment_status")
    private AppointmentStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name ="delivery_method ")
    private DeliveryMethod deliverymethod;
    @Column(name = "appointment_note", columnDefinition = "TEXT")
    private String appointmentNote;

    @OneToOne(mappedBy = "appointment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Result result;

    @OneToOne(mappedBy = "appointment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Feedback feedback;

    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
    }

    public enum AppointmentType {
        ADMINISTRATIVE, // Hành chính
        CIVIL           // Dân sự
    }
    public enum DeliveryMethod {
        HOME_COLLECTION,    // Lấy mẫu tại nhà

        SELF_DROP_OFF,      // Tự gửi đến phòng xét nghiệm

    }
    public enum AppointmentStatus {
        SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
    }
}