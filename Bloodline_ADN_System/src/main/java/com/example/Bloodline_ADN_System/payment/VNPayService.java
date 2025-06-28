package com.example.Bloodline_ADN_System.payment;

import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VNPayService {

    public String createPaymentUrl(PaymentRequest request, String ipAddress) {
        try {
            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", VNPayConfig.vnp_Version);
            vnp_Params.put("vnp_Command", VNPayConfig.vnp_Command_Pay);
            vnp_Params.put("vnp_TmnCode", VNPayConfig.vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(request.getAmount() * 100));
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", request.getTxnRef());
            vnp_Params.put("vnp_OrderInfo", request.getOrderInfo());
            vnp_Params.put("vnp_OrderType", "other");
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnUrl);
            vnp_Params.put("vnp_IpAddr", ipAddress);
            vnp_Params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));

            Map<String, String> sortedParams = new TreeMap<>(vnp_Params);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();

            for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();

                hashData.append(key).append('=').append(value).append('&');
                query.append(URLEncoder.encode(key, StandardCharsets.UTF_8.toString()))
                        .append('=')
                        .append(URLEncoder.encode(value, StandardCharsets.UTF_8.toString()))
                        .append('&');
            }

            hashData.setLength(hashData.length() - 1); // Xoá dấu & cuối
            query.setLength(query.length() - 1);

            String secureHash = VNPayUtils.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
            query.append("&vnp_SecureHash=").append(secureHash);

            return VNPayConfig.vnp_PayUrl + "?" + query;
        } catch (Exception e) {
            throw new RuntimeException("Tạo URL thanh toán thất bại", e);
        }
    }
}
