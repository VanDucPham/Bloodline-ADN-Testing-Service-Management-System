package com.example.Bloodline_ADN_System.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map tất cả đường dẫn /upload/** tới thư mục gốc trên ổ cứng
        registry.addResourceHandler("/upload/**")
                .addResourceLocations("file:Bloodline_ADN_System/upload/");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "https://bloodline-adn-testing-serv-git-dbd881-vanducs-projects-0cf321d4.vercel.app",
                        "http://localhost:5173"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
