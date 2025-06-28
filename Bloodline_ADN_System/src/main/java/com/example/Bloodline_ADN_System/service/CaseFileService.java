package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.Entity.CaseFile;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.caseFileDTO;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.caseFileResponse;

public interface CaseFileService {
    void save(caseFileDTO request);
    caseFileResponse getById(Long id);
    public String generateCaseCode(String type) ;
    boolean existCaseCode(String caseCode);
}
