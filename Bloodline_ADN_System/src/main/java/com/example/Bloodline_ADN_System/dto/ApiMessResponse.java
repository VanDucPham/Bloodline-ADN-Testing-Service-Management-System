package com.example.Bloodline_ADN_System.dto;

import lombok.Data;

@Data
public class ApiMessResponse {
    private boolean success;
    private String message;

    public ApiMessResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}
