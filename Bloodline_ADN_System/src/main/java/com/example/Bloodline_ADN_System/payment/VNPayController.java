package com.example.Bloodline_ADN_System.payment;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class VNPayController {

    @Autowired
    private VNPayService vnPayService;

    @PostMapping("/create-payment")
    public ResponseEntity<String> createPayment(@RequestBody PaymentRequest request, HttpServletRequest httpRequest) {
        String ip = httpRequest.getRemoteAddr();
        String paymentUrl = vnPayService.createPaymentUrl(request, ip);
        return ResponseEntity.ok(paymentUrl);
    }

    @GetMapping("/return")
    public ResponseEntity<String> handleVNPayReturn(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        Enumeration<String> paramNames = request.getParameterNames();
        while (paramNames.hasMoreElements()) {
            String name = paramNames.nextElement();
            String value = request.getParameter(name);
            params.put(name, value);
        }

        String receivedHash = params.get("vnp_SecureHash");
        if (receivedHash == null) {
            return ResponseEntity.badRequest().body("❌ Thiếu chữ ký");
        }

        String hashData = VNPayUtils.hashAllFieldsForReturn(params);
        String calculatedHash = VNPayUtils.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData);

        if (!calculatedHash.equalsIgnoreCase(receivedHash)) {
            return ResponseEntity.badRequest().body("❌ Chữ ký không hợp lệ");
        }

        String responseCode = params.get("vnp_ResponseCode");
        if ("00".equals(responseCode)) {
            return ResponseEntity.ok("✅ Thanh toán thành công!");
        } else {
            return ResponseEntity.ok("❌ Thanh toán thất bại. Mã: " + responseCode);
        }
    }
}
