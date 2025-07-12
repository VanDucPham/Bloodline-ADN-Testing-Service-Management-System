package org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.controller;

import jakarta.servlet.http.HttpSession;
import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo.Accounts;
import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo.Directors;
import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo.Movies;
import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.service.DirectorService;
import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.service.MoviesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
public class moviesController {
    @Autowired
    private MoviesService moviesService;
    @Autowired
    private DirectorService directorService;
    @GetMapping("/home")
    public String home(HttpSession session, Model model) {

        if (session.getAttribute("acc") != null) {
            List<Movies> moviesList = moviesService.getMovies() ;
            model.addAttribute("movies", moviesList);

            return "home";
        }
        return "redirect:/error";

    }
    @GetMapping("/delete/{id}")
    public String delete(@PathVariable int id, HttpSession session) {

        Accounts acc =  (Accounts) session.getAttribute("acc") ;
        if(acc != null && acc.getRoleID()== 1) {
            moviesService.deleteMovies(id);
            return "redirect:/home";
        }
        return "redirect:/error";
    }

    @GetMapping("/addmovies")
    public String add(HttpSession session, Model model) {
        Accounts acc = (Accounts) session.getAttribute("acc") ;
        List<Directors> list = directorService.getDirector() ;
        System.out.println(list.size());
        if(acc != null && acc.getRoleID()== 1) {
            model.addAttribute("movie", new Movies());
            model.addAttribute("directors", list);
            return "add";
        }
        return "redirect:/error";
    }
}
