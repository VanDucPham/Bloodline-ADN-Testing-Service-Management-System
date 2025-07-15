package com.example.Bloodline_ADN_System.service;

import org.springframework.stereotype.Service;
import java.text.Normalizer;

@Service
public class DistanceService {
    // Địa chỉ mặc định của bệnh viện
    private static final String HOSPITAL_ADDRESS = "Trường Đại học FPT, Lô E2a-7, Đường D1, Khu Công nghệ cao, Phường Long Thạnh Mỹ, Thành phố Thủ Đức, TP. Hồ Chí Minh";

    /**
     * Kiểm tra địa chỉ khách hàng có hợp lệ không (chứa 'Thủ Đức' không phân biệt hoa thường, có dấu hay không dấu)
     * @param customerAddress Địa chỉ khách hàng nhập
     * @return true nếu hợp lệ, false nếu không hợp lệ
     */
    public boolean isValidDistance(String customerAddress) {
        if (customerAddress == null || customerAddress.trim().isEmpty()) return false;
        String normalized = Normalizer.normalize(customerAddress, Normalizer.Form.NFD)
            .replaceAll("\\p{M}", "")
            .toLowerCase();
        return normalized.contains("thu duc");
    }

    public String getHospitalAddress() {
        return HOSPITAL_ADDRESS;
    }
} 