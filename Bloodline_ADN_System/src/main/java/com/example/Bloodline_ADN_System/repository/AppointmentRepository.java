package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.Entity.CaseFile;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Lấy danh sách lịch hẹn theo userId
    List<Appointment> findByUserUserId(Long userId);

    // Đếm số lượng lịch hẹn trong một khung giờ cụ thể trong ngày
    int countByAppointmentDateAndAppointmentTimeBetween(LocalDate date, LocalTime startTime, LocalTime endTime);



    // Kiểm tra xem user đã có lịch hẹn trong khoảng thời gian đó chưa
    boolean existsByUser_UserIdAndAppointmentDateAndAppointmentTimeBetween(
            Long userId, LocalDate date, LocalTime start, LocalTime end);

    // Truy vấn tuỳ chọn lọc
    @Query("SELECT a FROM Appointment a " +
            "WHERE (:status IS NULL OR a.status = :status) " +
            "AND (:type IS NULL OR a.type = :type) " +
            "AND (:date IS NULL OR a.appointmentDate = :date)")
    List<Appointment> findByFilters(@Param("status") Appointment.AppointmentStatus status,
                                    @Param("type") Appointment.AppointmentType type,
                                    @Param("date") LocalDate date);

    int countByAppointmentDateAndAppointmentTime(LocalDate appointmentDate, LocalTime appointmentTime);


    Appointment getAppointmentsByAppointmentId(Long appointmentId);


    @Query("SELECT a.caseFile.caseId FROM Appointment a WHERE a.appointmentId = :appointmentId")
    Long findCaseIdByAppointmentId(@Param("appointmentId") Long appointmentId);

    Optional<Appointment> findByCaseFile_CaseCode(String caseCode);

    @EntityGraph(attributePaths = {
            "caseFile",         // 👈 Lỗi chính ở đây
            "user",
            "assignedStaff",
            "participants.sample", // nested relation
            "result"
    })
    List<Appointment> findAll();

}
