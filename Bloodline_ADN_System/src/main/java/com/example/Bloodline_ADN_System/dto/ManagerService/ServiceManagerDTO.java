package com.example.Bloodline_ADN_System.dto.ManagerService;

import com.example.Bloodline_ADN_System.dto.ParticipantTypeDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceManagerDTO {
    private Long serviceId;
    private String serviceName;
    private String serviceDescription;

    private List<ParticipantTypeDTO> participantsType; // Danh sách tên đối tượng (Cha, Mẹ, ...)
    private Double servicePrice;
    private String imageUrl;
    private boolean isInUse;

}
