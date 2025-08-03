package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.CaseTrackingDTO;
import com.example.Bloodline_ADN_System.dto.PaymentDTO;
import com.example.Bloodline_ADN_System.service.PaymentService;
import com.example.Bloodline_ADN_System.service.impl.CaseTrackingServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/manager")
@AllArgsConstructor
public class ManagerController {
    private final CaseTrackingServiceImpl caseTrackingService;
    private final PaymentService paymentService;

    @GetMapping("/tracking")
    public List<CaseTrackingDTO> getAllTrackedCases() {
        return caseTrackingService.getAllCaseTracking();
    }

    @GetMapping("/tracking/{caseId}")
    public CaseTrackingDTO getCaseById(@PathVariable String caseId) {
        return caseTrackingService.getCaseTrackingByCaseCode(caseId);
    }

    @GetMapping("/payments")
    public ResponseEntity<List<PaymentDTO>> getProcessingPayments() {
        List<PaymentDTO> payments = paymentService.getProcessingPayments();
        return ResponseEntity.ok(payments);
    }

    @PutMapping("/payments/{paymentId}")
    public ResponseEntity<PaymentDTO> completePayment(@PathVariable Long paymentId) {
        PaymentDTO updated = paymentService.markPaymentAsCompleted(paymentId);
        return ResponseEntity.ok(updated);
    }
}
