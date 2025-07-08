package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.Appointment;
import com.example.Bloodline_ADN_System.Entity.Participant;
import com.example.Bloodline_ADN_System.Entity.Result;
import com.example.Bloodline_ADN_System.Entity.Sample;
import com.example.Bloodline_ADN_System.dto.ResultDTO;
import com.example.Bloodline_ADN_System.repository.AppointmentRepository;
import com.example.Bloodline_ADN_System.repository.ParticipantRepository;
import com.example.Bloodline_ADN_System.repository.ResultRepository;
import com.example.Bloodline_ADN_System.repository.SampleRepository;
import com.example.Bloodline_ADN_System.service.ResultService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class ResultServiceImpl implements ResultService {
    private final ResultRepository resultRepository;
    private final AppointmentRepository appointmentRepository;
    private final ParticipantRepository participantRepository;
    private final SampleRepository sampleRepository;

    //lấy kết quả từ appointment
    public ResultDTO getResultByAppointmentId(Long appointmentId) {
        return resultRepository.findByAppointment_AppointmentId(appointmentId)
                .map(this::toDTO)
                .orElse(null);
    }

    //kiểm tra xem đã đủ điều kiện để nhập kết quả chưa
    public String validateAppointmentForResult(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lịch hẹn"));

        List<Participant> participants = participantRepository.findByAppointment_AppointmentId(appointmentId);
        if (participants.size() < 2) {
            return "Lịch hẹn cần ít nhất 2 người tham gia.";
        }

        for (Participant participant : participants) {
            Sample sample = sampleRepository.findByParticipant_ParticipantId(participant.getParticipantId());
            if (sample == null) {
                return "Người tham gia " + participant.getName() + " chưa có mẫu.";
            }
            if (sample.getStatus() != Sample.SampleStatus.COMPLETED) {
                return "Mẫu của người tham gia " + participant.getName() + " chưa được phân tích.";
            }
        }
        return null; // OK
    }

    //staff nhập kết quả
    public ResultDTO createResult(ResultDTO dto) {
        // 1. Kiểm tra dữ liệu hợp lệ bằng hàm đã có
        String validationMessage = validateAppointmentForResult(dto.getAppointmentId());
        if (validationMessage != null) {
            throw new IllegalArgumentException(validationMessage);
        }

        // 2. Lấy appointment
        Appointment appointment = appointmentRepository.findById(dto.getAppointmentId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lịch hẹn"));

        Result result = new Result();
        result.setAppointment(appointment);
        result.setResultValue(dto.getResultValue());
        result.setNotes(dto.getNotes());
        result.setStatus(Result.ResultStatus.COMPLETED);
        result.setResultDate(LocalDateTime.now());  // ngày giờ hiện tại

        // 4. Lưu vào DB và trả về DTO
        Result saved = resultRepository.save(result);
        return toDTO(saved);
    }


    private ResultDTO toDTO(Result result) {
        ResultDTO dto = new ResultDTO();
        dto.setResultId(result.getResultId());
        dto.setAppointmentId(result.getAppointment().getAppointmentId());
        dto.setResultValue(result.getResultValue());
        dto.setResultDate(result.getResultDate());
        dto.setNotes(result.getNotes());
        dto.setStatus(result.getStatus());
        return dto;
    }
}
