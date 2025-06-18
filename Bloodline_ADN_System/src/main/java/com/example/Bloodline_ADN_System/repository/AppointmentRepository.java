package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.dto.AppointmentDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserUserId(Long userId);

    //Đếm số lượng lịch theo ngày giờ
    int countByAppointmentDateAndAppointmentTime(LocalDate date, LocalTime time);

    //Dùng để lọc các appointment, có thể lọc theo từng điều kiện họặc cả 3 điều kiện, nếu điều kiện rỗng sẽ hiển thị tất cả appointment
    @Query("SELECT a FROM Appointment a " +
            "WHERE (:status IS NULL OR a.status = :status) " +
            "AND (:type IS NULL OR a.type = :type) " +
            "AND (:date IS NULL OR a.appointmentDate = :date)")
    List<Appointment> findByFilters(@Param("status") Appointment.AppointmentStatus status,
                                    @Param("type") Appointment.AppointmentType type,
                                    @Param("date") LocalDate date);

}
