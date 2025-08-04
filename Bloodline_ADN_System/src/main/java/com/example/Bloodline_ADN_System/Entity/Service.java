package com.example.Bloodline_ADN_System.Entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

// ========================
// 📦 SERVICE ENTITY
// ========================
@Entity
@Table(name = "services")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Long serviceId;

    @Column(name = "service_name")
    private String serviceName;

    @Column(name = "service_description")
    private String serviceDescription;

    @Column(name = "limit_people")
    private Integer limitPeople;
    @ManyToMany(fetch = FetchType.EAGER)

    @JoinTable(
            name = "service_paticipantType",
            joinColumns = @JoinColumn(name = "service_id"),
            inverseJoinColumns = @JoinColumn(name = "participant_type_participantId")
    )
    private List<ParticipantType> participantType = new ArrayList<>();
    @Column(name = "service_price")
    private Double servicePrice;

    @Column(name = "image_url") // ✅ Thêm dòng này
    private String imageUrl;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL , fetch = FetchType.LAZY)
    @JsonIgnore
    private List<CaseFile> caseFiles = new ArrayList<>();

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Feedback> feedbacks = new ArrayList<>();

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Appointment> appointments = new ArrayList<>();
}
