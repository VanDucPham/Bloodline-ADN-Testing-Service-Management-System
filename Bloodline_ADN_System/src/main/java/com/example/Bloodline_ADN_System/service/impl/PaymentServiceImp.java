package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.Entity.Payment;
import com.example.Bloodline_ADN_System.payment.PaymentRequest;
import com.example.Bloodline_ADN_System.repository.AppointmentRepository;
import com.example.Bloodline_ADN_System.repository.PaymentRepository;
import com.example.Bloodline_ADN_System.service.AppointmentService;
import com.example.Bloodline_ADN_System.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImp implements PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    AppointmentRepository appointmentRepository;
    @Override
    public Payment createPayment(PaymentRequest paymentRequest, Long appointmentId) {
        Payment payment = new Payment();
        Appointment appointment = appointmentRepository.findById(appointmentId).get() ;
        payment.setAppointment(appointment);
        payment.setPaymentMethod(Payment.PaymentMethod.valueOf(paymentRequest.getPaymentMethod()));
        payment.setStatus(Payment.PaymentStatus.valueOf("COMPLETED"));
        payment.setAmount((double) paymentRequest.getAmount());
        paymentRepository.save(payment);
        return payment  ;
    }
}
