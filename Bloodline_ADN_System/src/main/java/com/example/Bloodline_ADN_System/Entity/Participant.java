package com.example.Bloodline_ADN_System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "participant")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Participant {
    @Id @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int participant_id;
    private String name ;
    private String relationship;
    private String gender ;
    private String cccd;
    private String address;
    private String birth_date;
    @ManyToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @OneToOne
    @JoinColumn(name="sample_id", nullable = false)
    private Sample sample;

}
