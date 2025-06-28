package com.example.Bloodline_ADN_System.payment;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class VNPayUtils {

    // Tạo chữ ký HMAC SHA512
    public static String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] hash = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception ex) {
            throw new RuntimeException("Lỗi khi mã hóa HMAC SHA512", ex);
        }
    }

    // ✅ Dùng để xác minh dữ liệu trả về từ VNPay (callback)
    public static String hashAllFieldsForReturn(Map<String, String> fields) {
        Map<String, String> filtered = new HashMap<>(fields);
        filtered.remove("vnp_SecureHash");
        filtered.remove("vnp_SecureHashType");

        Map<String, String> sorted = new TreeMap<>(filtered);
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> entry : sorted.entrySet()) {
            sb.append(entry.getKey()).append('=').append(entry.getValue()).append('&');
        }
        if (sb.length() > 0) {
            sb.setLength(sb.length() - 1); // Xóa dấu & cuối cùng
        }
        return sb.toString();
    }

    // (Optional) Tạo full URL khi bạn muốn dựng link bằng tay
    public static String buildVNPayUrl(Map<String, String> params, String hashSecret, String vnp_Url) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (int i = 0; i < fieldNames.size(); i++) {
            String key = fieldNames.get(i);
            String value = params.get(key);

            hashData.append(key).append('=').append(value); // KHÔNG encode

            // ENCODE cho query URL
            String encodedKey = URLEncoder.encode(key, StandardCharsets.UTF_8);
            String encodedValue = URLEncoder.encode(value, StandardCharsets.UTF_8);
            query.append(encodedKey).append('=').append(encodedValue);

            if (i < fieldNames.size() - 1) {
                hashData.append('&');
                query.append('&');
            }
        }

        String secureHash = hmacSHA512(hashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);

        return vnp_Url + "?" + query;
    }
}
