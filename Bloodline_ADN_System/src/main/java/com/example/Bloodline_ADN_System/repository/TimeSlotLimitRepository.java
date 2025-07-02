package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.TimeSlotLimit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface TimeSlotLimitRepository  extends JpaRepository<TimeSlotLimit, Long> {

    Optional<TimeSlotLimit> findByStartTimeLessThanEqualAndEndTimeGreaterThanEqual(LocalTime startTime, LocalTime endTime);

    Optional<TimeSlotLimit> findByStartTimeAndEndTime(LocalTime startTime, LocalTime endTime);
    List<TimeSlotLimit> findAllByOrderByStartTimeAsc();

}
