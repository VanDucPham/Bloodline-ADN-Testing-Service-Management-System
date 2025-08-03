package com.example.Bloodline_ADN_System.dto.noneWhere;

import com.example.Bloodline_ADN_System.dto.ParticipantTypeDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceDTO {
    private String serviceName;
    private String serviceDescription;
    private Long serviceId;
    private Integer Limit_people ;
    private Double servicePrice ;
    private String imageUrl;
    private List<ParticipantTypeDTO> participantsType;

    public ServiceDTO(String serviceName, Integer limitPeople, String serviceDescription, Long serviceId, Double servicePrice, String imageUrl) {
        this.serviceName = serviceName;
        this.Limit_people = limitPeople;
        this.serviceDescription = serviceDescription;
        this.serviceId = serviceId;
        this.servicePrice = servicePrice;
        this.imageUrl = imageUrl;
    }

    public ServiceDTO(String serviceName, Integer limitPeople, String serviceDescription, Long serviceId, Double servicePrice, String imageUrl, List<ParticipantTypeDTO> participantsType) {
        this.serviceName = serviceName;
        this.Limit_people = limitPeople;
        this.serviceDescription = serviceDescription;
        this.serviceId = serviceId;
        this.servicePrice = servicePrice;
        this.imageUrl = imageUrl;
        this.participantsType = participantsType;
    }
}

