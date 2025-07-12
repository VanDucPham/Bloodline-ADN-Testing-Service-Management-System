package org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771;

import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo.Accounts;
import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo.Directors;
import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo.Movies;
import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.service.AccountServices;
import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.service.DirectorService;
import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.service.MoviesService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan({"org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.controller", "org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.service"})
@EnableJpaRepositories(basePackages = "org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.repository")
@EntityScan(basePackages = "org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo")
public class PeHsf302TrialexamDucpvse181771Application  implements CommandLineRunner {

    private final AccountServices accountServices;
    private final DirectorService directorService;
    private final MoviesService moviesService;

    public PeHsf302TrialexamDucpvse181771Application(AccountServices accountServices,  DirectorService directorService, MoviesService moviesService) {
        this.accountServices = accountServices;
        this.directorService = directorService;
        this.moviesService = moviesService;

    }

    public static void main(String[] args) {
        SpringApplication.run(PeHsf302TrialexamDucpvse181771Application.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
//        Accounts account1 = new Accounts("admin@cinestar.com","@4", 1);
//        Accounts acc2 = new Accounts("custome@cinestar.com","@4", 4);
//        Accounts acc3 = new Accounts("manager@cinestar.com","@4", 3);
//        Accounts acc4 = new Accounts("staff@cinestar.com","@4", 2);
//
//        accountServices.createAccount(account1);
//        accountServices.createAccount(acc2);
//        accountServices.createAccount(acc3);
//        accountServices.createAccount(acc4);
//
//
//
//        Directors dr1 = new Directors("Phontharis", "Thailand");
//        Directors dr2 = new Directors("Fujiko", "Japan");
//        Directors dr3 = new Directors("James", "Cameron");
//
//        directorService.createDirector(dr1);
//        directorService.createDirector(dr2);
//        directorService.createDirector(dr3);
//
//
//
//
//        // Assuming dr1, dr2, dr3 are already defined Directors objects
//        Movies mv1 = new Movies( "PEE NAK 4", 125, "Witthawat", "active", dr1);
//        Movies mv2 = new Movies("Doraemon", 115, "Nobita", "active", dr2);
//        Movies mv3 = new Movies("Doraemon 2022", 120, "Doraemon", "inactive", dr2);
//        Movies mv4 = new Movies( "Avatar", 192, "Kate Winslet", "inactive", dr3);
//
//        moviesService.createMovies(mv1);
//        moviesService.createMovies(mv2);
//        moviesService.createMovies(mv3);
//        moviesService.createMovies(mv4);


    }
}
