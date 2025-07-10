package com.example.Bloodline_ADN_System.dto.noneWhere;

import lombok.AllArgsConstructor;
import lombok.Data;



import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceDTO {
    private String serviceName;
    private String serviceDescription;
    private Long serviceId;
    private Integer Limit_people ;
    private Double servicePrice ;

    public ServiceDTO(Long serviceId, String serviceName, Integer Limit_people,String serviceDescription, Double servicePrice) {
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.Limit_people = Limit_people;
        this.serviceDescription = serviceDescription;
        this.servicePrice = servicePrice;
    }



    public ServiceDTO(String serviceName, Integer limitPeople, String serviceDescription, Long serviceId, Double servicePrice) {
    }
}

