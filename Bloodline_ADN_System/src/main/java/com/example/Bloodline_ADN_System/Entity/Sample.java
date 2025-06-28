package com.example.Bloodline_ADN_System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

// ========================
// 🧪 SAMPLE ENTITY
// ========================
@Entity
@Table(name = "samples")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sample {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sampleId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_id")
    private Participant participant;

    @Enumerated(EnumType.STRING)
    private SampleType sampleType;

    @Column(name = "collection_datetime")
    private LocalDateTime collectionDateTime;

    @Enumerated(EnumType.STRING)
    private SampleQuality quality;

    @Enumerated(EnumType.STRING)
    private SampleStatus status;

    private String result;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public enum SampleType { BLOOD, SALIVA, HAIR, OTHER }
    public enum SampleQuality { EXCELLENT, GOOD, FAIR, POOR }
    public enum SampleStatus { COLLECTED, PROCESSING, ANALYZED, COMPLETED }
}