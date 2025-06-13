package com.example.Bloodline_ADN_System.dto;

import lombok.Data;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Data

public class CreateUserRequest {
    private String fullName ;
    private String email ;
    private String password ;
    private String role ;
}
