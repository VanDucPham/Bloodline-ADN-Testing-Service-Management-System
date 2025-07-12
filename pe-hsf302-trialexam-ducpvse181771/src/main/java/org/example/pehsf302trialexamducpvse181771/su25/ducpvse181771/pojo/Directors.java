package org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name= "Directors")
public class Directors {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="ID")
    private int id;
    @Column(name="DirectorName", columnDefinition = "nvarchar(100)")
    private String directorName;
    @Column(name ="Nationally", columnDefinition = "nvarchar(150)")
    private String nationally;

    @OneToMany(mappedBy = "director", cascade = CascadeType.ALL)
    private List<Movies> movies;

    public Directors() {
    }

    public Directors( String directorName, String nationally) {
        this.directorName = directorName;
        this.nationally = nationally;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDirectionName() {
        return directorName;
    }

    public void setDirectorName(String directionName) {
        this.directorName = directorName;
    }

    public String getNationally() {
        return nationally;
    }

    public void setNationally(String nationally) {
        this.nationally = nationally;
    }
}
