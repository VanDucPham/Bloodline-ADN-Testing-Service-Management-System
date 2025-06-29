package com.example.Bloodline_ADN_System.dto;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class ServiceDTO {
    private Long serviceId;
    private String serviceName;
    private String serviceDescription;
    private Double servicePrice;

}

import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceDTO {
    private String serviceName;
    private String serviceDescription;
    private Long serviceId;
    private Double servicePrice ;
}

