package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.dto.*;
import java.util.List;

public interface ManagerService {
    List<StaffDTO> getAllStaff();
    List<StaffDTO> searchStaff(String keyword);
    void deactivateStaff(Long userId);
    RevenueResponse getRevenueByMonth(int month, int year);
    RevenueResponse getRevenueByYear(int year);
    List<PaymentDTO> getAllCompletedPayments();
    List<ServiceUsageDTO> getTopUsedServices();
}