package com.example.Bloodline_ADN_System.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "appointment")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int appointment_id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service services;
    @OneToMany(mappedBy = "appointment")
    private List<Participant> participants;

    @OneToOne(mappedBy = "appointment", cascade = CascadeType.ALL)
    private Payment payment;
    private String type; // Hành chính hay dân sự
    private LocalDateTime creat_time;
    private Date appointment_date;
    private Time appointment_time;
    private String appointment_status;
    private String appointment_note;

    @OneToOne(mappedBy = "appointment")
    private Result result;
    @OneToOne(mappedBy = "appointment")
    private Feedback feedback;
}