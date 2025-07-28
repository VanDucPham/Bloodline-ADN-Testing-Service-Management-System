package com.example.Bloodline_ADN_System.repository;

import com.example.Bloodline_ADN_System.Entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Optional<Feedback> findByAppointment_AppointmentId(Long appointmentId);
    List<Feedback> findByUser_UserId(Long userId);
    List<Feedback> findByService_ServiceId(Long serviceId);
    
    // Đếm số lượng feedback theo service ID
    long countByService_ServiceId(Long serviceId);

    // Lấy tất cả feedback và fetch luôn user (tránh lỗi lazy)
    @Query("SELECT f FROM Feedback f JOIN FETCH f.user")
    List<Feedback> findAllWithUser();

    // Lấy feedback theo serviceId và fetch luôn user
    @Query("SELECT f FROM Feedback f JOIN FETCH f.user WHERE f.service.serviceId = :serviceId")
    List<Feedback> findByServiceIdWithUser(Long serviceId);

    @Query("SELECT f FROM Feedback f JOIN FETCH f.user JOIN FETCH f.service")
    List<Feedback> findAllWithUserAndService();
}
