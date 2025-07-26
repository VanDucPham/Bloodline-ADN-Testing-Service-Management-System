package com.example.Bloodline_ADN_System.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dbupz8o9s",
                "api_key", "668971781997894",
                "api_secret", "mkqiuK7NJar_c7A0d57sF3mfsWo"
        ));
    }
}
