package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.Entity.CaseFile;
import com.example.Bloodline_ADN_System.dto.managerCaseFile.caseFileDTO;

import java.util.List;

public interface CaseFileService {

    CaseFile  createCaseFile(caseFileDTO req);



    List<CaseFile> findAll() ;
    CaseFile findById(int id);

    List<CaseFile> findByFileName(String fileName);
    List<CaseFile> findByFileType(String fileType);
    public String generateCaseCode(String type) ;

}
