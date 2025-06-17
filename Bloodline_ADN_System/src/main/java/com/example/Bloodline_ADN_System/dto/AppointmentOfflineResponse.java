package com.example.Bloodline_ADN_System.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentOfflineResponse<T> {
    private String message;
    private T data;
}
