package org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.service;

import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo.Movies;

import java.util.List;

public interface MoviesService {
    public void createMovies(Movies movies);
    public List<Movies> getMovies();
    public void updateMovies(Integer id,Movies movies);
    public void deleteMovies(int id);
}
