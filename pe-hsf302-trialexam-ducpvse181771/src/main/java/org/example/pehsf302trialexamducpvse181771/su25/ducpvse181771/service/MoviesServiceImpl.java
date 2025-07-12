package org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.service;

import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo.Directors;
import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo.Movies;
import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.repository.DirectorRepository;
import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.repository.MoviesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MoviesServiceImpl implements MoviesService {

    @Autowired
    private MoviesRepository moviesRepository;

    @Autowired
    private DirectorRepository directorsRepository;

    @Override
    public void createMovies(Movies movies) {
            moviesRepository.save(movies);
    }

    @Override
    public List<Movies> getMovies() {

        return moviesRepository.findAll();
    }

    @Override
    public void updateMovies(Integer id, Movies movies) {
        Optional<Movies> movie = moviesRepository.findById(id);
        Optional<Directors> directorOpt = directorsRepository.findById(movies.getDirector().getId());

        if (movie.isPresent() && directorOpt.isPresent()) {
            Movies m = movie.get();
            m.setMovieName(movies.getMovieName());
            m.setActor(movies.getActor());
            m.setDuration(movies.getDuration());
            m.setStatus(movies.getStatus());
            m.setDirector(directorOpt.get());

            moviesRepository.save(m); // Quan trọng: phải gọi save để cập nhật
        } else {
            // Có thể ném ra exception hoặc ghi log tùy ứng dụng
            System.out.println("Movie hoặc Director không tồn tại!");
        }
    }


    @Override
    public void deleteMovies(int id) {
        moviesRepository.deleteById(id);

    }
}
