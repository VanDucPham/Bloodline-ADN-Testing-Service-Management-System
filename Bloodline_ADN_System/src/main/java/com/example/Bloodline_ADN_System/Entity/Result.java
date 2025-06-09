package com.example.Bloodline_ADN_System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "results")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private Long resultId;

    @Enumerated(EnumType.STRING)
    @Column(name = "test_type")
    private TestType testType;

    @Column(name = "result_value", columnDefinition = "TEXT")
    private String resultValue;

    @Column(name = "result_date")
    private LocalDateTime resultDate;

    @Enumerated(EnumType.STRING)
    private ResultStatus status;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    public enum TestType {
        DNA_PATERNITY, DNA_MATERNITY, DNA_SIBLINGSHIP, DNA_GRANDPARENTAGE
    }

    public enum ResultStatus {
        PENDING, IN_PROGRESS, COMPLETED, REVIEWED
    }
}