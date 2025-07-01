package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.Entity.Feedback;
import com.example.Bloodline_ADN_System.Entity.ServiceEntity;
import com.example.Bloodline_ADN_System.Entity.User;
import com.example.Bloodline_ADN_System.dto.FeedbackDTO;
import com.example.Bloodline_ADN_System.dto.FeedbackResponse;
import com.example.Bloodline_ADN_System.repository.AppointmentRepository;
import com.example.Bloodline_ADN_System.repository.FeedbackRepository;
import com.example.Bloodline_ADN_System.repository.ServiceRepository;
import com.example.Bloodline_ADN_System.repository.UserRepository;
import com.example.Bloodline_ADN_System.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final ServiceRepository serviceRepository;


    //Customer viết feedback
    @Override
    public FeedbackResponse createFeedback(FeedbackDTO feedbackDTO) {
        User user = userRepository.findById(feedbackDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        ServiceEntity serviceEntity = serviceRepository.findById(feedbackDTO.getServiceId())
                .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại"));
        Appointment appointment = appointmentRepository.findById(feedbackDTO.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Lịch hẹn không tồn tại"));

        Feedback feedback = new Feedback();
        feedback.setUser(user);
        feedback.setService(serviceEntity);
        feedback.setAppointment(appointment);
        feedback.setFeedbackText(feedbackDTO.getFeedbackText());
        feedback.setRating(feedbackDTO.getRating());

        Feedback saved = feedbackRepository.save(feedback);
        return toDTO(saved);
    }

    //Admin xem được feedback thông qua Appointment ID
    public FeedbackResponse getFeedbackByAppointmentId(Long appointmentId) {
        Feedback feedback = feedbackRepository.findByAppointment_AppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Feedback không tồn tại " + appointmentId));

        return toDTO(feedback);
    }

    private FeedbackResponse toDTO(Feedback feedback) {
        FeedbackResponse response = new FeedbackResponse();
        response.setFeedbackId(feedback.getFeedbackId());
        response.setUserId(feedback.getUser().getUserId());
        response.setServiceId(feedback.getService().getServiceId());
        response.setAppointmentId(feedback.getAppointment().getAppointmentId());
        response.setFeedbackText(feedback.getFeedbackText());
        response.setRating(feedback.getRating());
        response.setFeedbackDate(feedback.getFeedbackDate());
        return response;
    }

}
