package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.TimeSlotLimit;
import com.example.Bloodline_ADN_System.dto.TimeSlotLimitRequest;
import com.example.Bloodline_ADN_System.dto.TimeSlotLimitResponse;
import com.example.Bloodline_ADN_System.repository.TimeSlotLimitRepository;
import com.example.Bloodline_ADN_System.service.Time_slot_limit_Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class Time_slot_limit_Impl implements Time_slot_limit_Service {

    private final TimeSlotLimitRepository timeSlotLimitRepository;

    @Autowired
    public Time_slot_limit_Impl(TimeSlotLimitRepository timeSlotLimitRepository) {
        this.timeSlotLimitRepository = timeSlotLimitRepository;
    }

    @Override
    public List<TimeSlotLimit> getTimeSlotLimit() {
        return timeSlotLimitRepository.findAll(Sort.by("startTime"));
    }

    @Override
    public TimeSlotLimitResponse create(TimeSlotLimitRequest request) {
        validate(request, true);

        TimeSlotLimit slot = new TimeSlotLimit();
        // ✅ NOTE: Dùng .trim() để tránh lỗi xuống dòng/khoảng trắng
        slot.setStartTime(LocalTime.parse(request.getStartTime().trim()));
        slot.setEndTime(LocalTime.parse(request.getEndTime().trim()));
        slot.setMaxAppointments(request.getMaxAppointments());

        timeSlotLimitRepository.save(slot);
        return toResponse(slot);
    }

    @Override
    public TimeSlotLimitResponse update(TimeSlotLimitRequest request) {
        validate(request, false);

        // Lấy slot cũ theo oldStartTime, oldEndTime
        LocalTime originalStart = LocalTime.parse(request.getOldStartTime().trim());
        LocalTime originalEnd = LocalTime.parse(request.getOldEndTime().trim());
        Optional<TimeSlotLimit> optional = timeSlotLimitRepository.findByStartTimeAndEndTime(originalStart, originalEnd);
        if (optional.isEmpty()) {
            throw new RuntimeException("Time slot not found.");
        }

        TimeSlotLimit slot = optional.get();
        slot.setStartTime(LocalTime.parse(request.getStartTime().trim()));
        slot.setEndTime(LocalTime.parse(request.getEndTime().trim()));
        slot.setMaxAppointments(request.getMaxAppointments());

        timeSlotLimitRepository.save(slot);
        return toResponse(slot);
    }

    @Override
    public void delete(String startTimeStr, String endTimeStr) {
        // ✅ NOTE: Xử lý trim khi parse
        LocalTime start = LocalTime.parse(startTimeStr.trim());
        LocalTime end = LocalTime.parse(endTimeStr.trim());
        Optional<TimeSlotLimit> optional = timeSlotLimitRepository.findByStartTimeAndEndTime(start, end);
        optional.ifPresent(timeSlotLimitRepository::delete);
    }

    @Override
    public TimeSlotLimitResponse get(String startTimeStr, String endTimeStr) {
        // ✅ NOTE: Xử lý trim khi parse
        LocalTime start = LocalTime.parse(startTimeStr.trim());
        LocalTime end = LocalTime.parse(endTimeStr.trim());
        TimeSlotLimit slot = timeSlotLimitRepository.findByStartTimeAndEndTime(start, end)
                .orElseThrow(() -> new RuntimeException("Time slot not found."));
        return toResponse(slot);
    }

    @Override
    public List<TimeSlotLimitResponse> getAll() {
        return timeSlotLimitRepository.findAllByOrderByStartTimeAsc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // -----------------------
    // Validate thủ công
    private void validate(TimeSlotLimitRequest request, boolean isCreate) {
        if (request.getStartTime() == null || request.getEndTime() == null) {
            throw new IllegalArgumentException("Start time and end time are required.");
        }
        if (request.getMaxAppointments() < 1) {
            throw new IllegalArgumentException("Max appointments must be at least 1.");
        }

        LocalTime start, end;
        try {
            // ✅ NOTE: Dùng trim() để tránh lỗi nếu chuỗi có \n hoặc dấu cách
            start = LocalTime.parse(request.getStartTime().trim());
            end = LocalTime.parse(request.getEndTime().trim());
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid time format. Use HH:mm.");
        }

        if (!start.isBefore(end)) {
            throw new IllegalArgumentException("Start time must be before end time.");
        }

        List<TimeSlotLimit> allSlots = timeSlotLimitRepository.findAll();
        for (TimeSlotLimit slot : allSlots) {
            boolean isSameSlot = slot.getStartTime().equals(start) && slot.getEndTime().equals(end);
            if (!isCreate && isSameSlot) continue;

            boolean overlaps = !(end.isBefore(slot.getStartTime()) || start.isAfter(slot.getEndTime()));
            if (overlaps) {
                throw new IllegalArgumentException("Time slot overlaps with existing slot: " + slot.getStartTime() + " - " + slot.getEndTime());
            }
        }
    }

    private TimeSlotLimitResponse toResponse(TimeSlotLimit slot) {
        TimeSlotLimitResponse res = new TimeSlotLimitResponse();
        res.setStartTime(slot.getStartTime().toString());
        res.setEndTime(slot.getEndTime().toString());
        res.setMaxAppointments(slot.getMaxAppointments());
        return res;
    }
}
