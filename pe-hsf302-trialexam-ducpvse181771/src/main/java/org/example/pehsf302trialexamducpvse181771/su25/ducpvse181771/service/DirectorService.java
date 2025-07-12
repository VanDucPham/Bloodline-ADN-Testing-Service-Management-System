package org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.service;

import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo.Directors;

import java.util.List;

public interface DirectorService {
    public void createDirector(Directors director) ;
    public void updateDirector(Directors director) ;
    public void deleteDirector(Directors director) ;
    public List<Directors> getDirector() ;

}
