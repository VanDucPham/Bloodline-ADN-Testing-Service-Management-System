package com.example.Bloodline_ADN_System.payment;

public class VNPayConfig {
    public static final String vnp_Version = "2.1.0";
    public static final String vnp_Command = "pay";
    public static final String vnp_TmnCode = "5SWIH8AN";
    public static final String vnp_HashSecret = "W3X2TKROJ5VMVIUJHMHY7TRPBOQSQ788";
    public static final String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

   // public static final String vnp_ReturnUrl = "https://localhost:8080/api/auth/vnpay/return";
    public static final String vnp_ReturnUrl = "https://348d518c4212.ngrok-free.app/api/auth/vnpay/return";

}
