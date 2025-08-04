package com.example.Bloodline_ADN_System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="ParticipantType")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Participant_id")
    private Integer participantId;


    private String participantName;

    @ManyToMany(mappedBy = "participantType")
    @JsonIgnore
    private List<Service> services = new ArrayList<>() ;

}
