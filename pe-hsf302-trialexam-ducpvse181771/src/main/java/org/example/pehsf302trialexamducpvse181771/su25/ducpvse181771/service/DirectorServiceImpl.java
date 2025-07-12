package org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.service;

import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo.Directors;
import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.repository.DirectorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class DirectorServiceImpl implements DirectorService {

    @Autowired
    private DirectorRepository directorRepository;
    @Override
    public void createDirector(Directors director) {
        directorRepository.save(director);

    }

    @Override
    public void updateDirector(Directors director) {

    }

    @Override
    public void deleteDirector(Directors director) {

    }

    @Override
    public List<Directors> getDirector() {
        return directorRepository.findAll();
    }
}
