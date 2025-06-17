package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.dto.AppointmentOfflineDTO;
import com.example.Bloodline_ADN_System.dto.AppointmentOfflineResponse;

public interface AppointmentOfflineService {
    AppointmentOfflineResponse<AppointmentOfflineDTO> createAppointmentOffline(AppointmentOfflineDTO dto);
}
