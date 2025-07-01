package com.example.Bloodline_ADN_System.service.impl;

import com.example.Bloodline_ADN_System.Entity.CaseFile;
import com.example.Bloodline_ADN_System.Entity.ServiceEntity;
import com.example.Bloodline_ADN_System.Entity.User;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.caseFileDTO;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.caseFileResponse;
import com.example.Bloodline_ADN_System.repository.CaseFileRepository;
import com.example.Bloodline_ADN_System.repository.ServiceRepository;
import com.example.Bloodline_ADN_System.service.CaseFileService;

import java.time.LocalDateTime;
import java.util.Optional;

@org.springframework.stereotype.Service
public class CaseFileServiceImpl implements CaseFileService {
    private final UserServiceImpl userServiceImpl;
    private final CaseFileRepository caseFileRepository;
    private final ServiceRepository serviceRepository;

    public CaseFileServiceImpl(UserServiceImpl userServiceImpl,
                               CaseFileRepository caseFileRepository,
                               ServiceRepository serviceRepository) {
        this.userServiceImpl = userServiceImpl;
        this.caseFileRepository = caseFileRepository;
        this.serviceRepository = serviceRepository;
    }


    @Override
    public void save(caseFileDTO req) {
        CaseFile caseFile = new CaseFile();
        caseFile.setCaseCode(req.getCaseCode());
        caseFile.setCaseType(CaseFile.CaseType.valueOf(req.getCaseType()));
        caseFile.setStatus(CaseFile.CaseStatus.valueOf(req.getStatus()));
        caseFile.setCreatedAt(LocalDateTime.now());

        Optional<User> createdBy = userServiceImpl.getUserById(req.getCreatedByUserId());
        if (createdBy.isEmpty()) {
            throw new RuntimeException("Không tìm thấy user với ID: " + req.getCreatedByUserId());
        }
        caseFile.setCreatedBy(createdBy.get());



        if (req.getServiceId() != null) {
            Optional<ServiceEntity> serviceOpt = serviceRepository.findById(req.getServiceId());
            if (serviceOpt.isEmpty()) {
                throw new RuntimeException("Không tìm thấy dịch vụ với ID: " + req.getServiceId());
            }
            caseFile.setService(serviceOpt.get());
        }

    }

    @Override
    public caseFileResponse getById(Long id) {
        CaseFile caseFile = caseFileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ với ID: " + id));

        caseFileResponse res = new caseFileResponse();
       // res.setId(caseFile.getCaseId());
        res.setCaseCode(caseFile.getCaseCode());
        res.setCaseType(caseFile.getCaseType().name());
        res.setStatus(caseFile.getStatus().name());
        res.setCreatedBy(caseFile.getCreatedBy());
        res.setCreatedAt(caseFile.getCreatedAt());

        if (caseFile.getService() != null) {
            res.setServiceId(caseFile.getService().getServiceId());
            res.setServiceName(caseFile.getService().getServiceName());
        }

        return res;
    }

    @Override
    public String generateCaseCode(String type) {
        String prefix = switch (type.toUpperCase()){
            case "ADMINISTRATIVE" -> "HC";
            case "CIVIL" -> "DS";
            default -> "N";
        } ;
        String caseCode ;
        int retry = 0 ;
        do{
            String timsemap = String.valueOf(System.currentTimeMillis()).substring(7);
            caseCode = prefix + timsemap;
            retry++;
            if(retry> 5){
                throw new RuntimeException("Không thế tạo mã hồ sơ duy nhaats sau 5 lần thử");
            }
        }while(caseFileRepository.existsCaseFilesByCaseCode(caseCode))  ;


        return caseCode;
    }

    @Override
    public boolean existCaseCode(String caseCode) {

        return false;
    }


}
