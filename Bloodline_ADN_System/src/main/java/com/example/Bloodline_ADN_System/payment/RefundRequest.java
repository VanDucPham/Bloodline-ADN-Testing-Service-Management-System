package com.example.Bloodline_ADN_System.payment;

import lombok.Data;

@Data
public class RefundRequest {
    private String trantype;
    private String orderId;
    private String amount;
    private String transDate;
    private String user;
}
