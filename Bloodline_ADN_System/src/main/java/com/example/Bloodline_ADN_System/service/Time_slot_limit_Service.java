package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.Entity.TimeSlotLimit;
import com.example.Bloodline_ADN_System.dto.TimeSlotLimitRequest;
import com.example.Bloodline_ADN_System.dto.TimeSlotLimitResponse;

import java.util.List;

public interface Time_slot_limit_Service {
    List<TimeSlotLimit> getTimeSlotLimit();
    TimeSlotLimitResponse create(TimeSlotLimitRequest request);
    TimeSlotLimitResponse update(TimeSlotLimitRequest request);
    void delete(String startTime, String endTime);
    TimeSlotLimitResponse get(String startTime, String endTime);
    List<TimeSlotLimitResponse> getAll();
}
