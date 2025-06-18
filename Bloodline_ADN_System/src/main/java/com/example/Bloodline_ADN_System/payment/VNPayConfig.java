package com.example.Bloodline_ADN_System.payment;

public class VNPayConfig {
    public static final String vnp_Version = "2.1.0";
    public static final String vnp_Command_Pay = "pay";
    public static final String vnp_Command_Refund = "refund";
    public static final String vnp_TmnCode = "L64M17UH";
    public static final String vnp_HashSecret = "37W91V3QARFV39OL5EQ63APWBQ9XUQK8";
    public static final String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static final String vnp_ApiUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";
    public static final String vnp_ReturnUrl = "http://localhost:8080/api/auth/return";
}
