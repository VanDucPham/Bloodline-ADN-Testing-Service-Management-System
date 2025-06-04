package com.example.Bloodline_ADN.entity;


import jakarta.persistence.*;
        import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "service")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Service {
    @Id @GeneratedValue
    private int service_id;
    private String service_name;
    private String service_description;
    private double service_price;
    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL)
    private List<FeedBack> feedBacks; // Danh sách các dịch vụ liên quan (nếu có, ví dụ: gói dịch vụ)


}