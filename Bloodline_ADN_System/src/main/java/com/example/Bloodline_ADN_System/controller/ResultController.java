package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.dto.ResultResponseDTO;
import com.example.Bloodline_ADN_System.repository.ResultRepository;
import com.example.Bloodline_ADN_System.Entity.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultRepository resultRepository;

    @GetMapping
    public ResponseEntity<List<ResultResponseDTO>> getResultsForCustomer(Authentication authentication) {
        String email = authentication.getName(); // lấy từ token

        List<Result> results = resultRepository.findByAppointment_User_Email(email);

        List<ResultResponseDTO> dtoList = results.stream()
                .map(result -> new ResultResponseDTO(
                        result.getAppointment().getAppointmentId(),
                        result.getTestType(),
                        result.getResultValue(),
                        result.getResultDate(),
                        result.getStatus(),
                        result.getNotes()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }
}
