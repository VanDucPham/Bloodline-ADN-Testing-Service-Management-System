package com.example.Bloodline_ADN_System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "participants")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participant_id")
    private Long participantId;

    @Column(nullable = false)
    private String name;

    private String relationship;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "citizen_id") // CCCD
    private String citizenId;

    private String address;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @OneToOne(mappedBy = "participant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Sample sample;

    public enum Gender {
        MALE, FEMALE, OTHER
    }
}