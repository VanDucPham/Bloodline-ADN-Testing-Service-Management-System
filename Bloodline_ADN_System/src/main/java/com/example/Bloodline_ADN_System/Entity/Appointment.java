package com.example.Bloodline_ADN_System.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

// ========================
// 📅 APPOINTMENT ENTITY
// ========================
@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long appointmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private Service service;

    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Participant> participants = new ArrayList<>();

    @OneToOne(mappedBy = "appointment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Payment payment;

    @Enumerated(EnumType.STRING)
    private AppointmentType type;

    private LocalDateTime createdTime;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    @Enumerated(EnumType.STRING)
    private DeliveryMethod deliverymethod;

    @Column(columnDefinition = "TEXT")
    private String appointmentNote;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id")
    private CaseFile caseFile;

    @OneToOne(mappedBy = "appointment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Result result;

    @OneToOne(mappedBy = "appointment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Feedback feedback;

    @OneToOne(mappedBy = "appointment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private QRCode qrCode;

    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
    }

    public enum AppointmentType { ADMINISTRATIVE, CIVIL }
    public enum DeliveryMethod { HOME_COLLECTION, SELF_DROP_OFF }
    public enum AppointmentStatus { SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED }

}