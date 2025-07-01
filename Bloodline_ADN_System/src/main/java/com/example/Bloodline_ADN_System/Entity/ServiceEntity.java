package com.example.Bloodline_ADN_System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

// ========================
// 📦 SERVICE ENTITY
// ========================
@Entity
@Table(name = "services")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Long serviceId;

    @Column(name = "service_name")
    private String serviceName;

//    @Column(columnDefinition = "TEXT")
    @Column(name ="service_description")
    private String serviceDescription;

    @Column(name = "service_price")
    private Double servicePrice;
    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL , fetch = FetchType.LAZY)
    private List<CaseFile> caseFiles = new ArrayList<>() ;
    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Feedback> feedbacks = new ArrayList<>();

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Appointment> appointments = new ArrayList<>();
}
