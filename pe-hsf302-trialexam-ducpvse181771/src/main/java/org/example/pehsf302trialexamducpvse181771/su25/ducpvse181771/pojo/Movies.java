package org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo;

import jakarta.persistence.*;

@Entity
@Table(name ="Movies")
public class Movies {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MovieID")
    private int movieID;
    @Column(name="Movie_Name",columnDefinition = "nvarchar(50)")
    private String movieName;
    @Column(name = "Duration")
    private int duration;
    @Column(name="Actor",columnDefinition = "nvarchar(50)")
    private String actor;
    @Column(name ="Status",columnDefinition = "nvarchar(50)")
    private String status;

    @ManyToOne
    @JoinColumn(name = "DirectorID", nullable  = false)
    private Directors director;

    public Movies() {
    }

    public Movies( String movieName, int duration, String actor, String status, Directors director) {

        this.movieName = movieName;
        this.duration = duration;
        this.actor = actor;
        this.status = status;
        this.director = director;
    }

    public Directors getDirector() {
        return director;
    }

    public void setDirector(Directors director) {
        this.director = director;
    }

    public int getMovieID() {
        return movieID;
    }

    public void setMovieID(int movieID) {
        this.movieID = movieID;
    }

    public String getMovieName() {
        return movieName;
    }

    public void setMovieName(String movieName) {
        this.movieName = movieName;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public String getActor() {
        return actor;
    }

    public void setActor(String actor) {
        this.actor = actor;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
