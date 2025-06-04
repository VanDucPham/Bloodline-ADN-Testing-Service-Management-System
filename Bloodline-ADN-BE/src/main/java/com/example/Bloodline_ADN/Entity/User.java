package com.example.Bloodline_ADN.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "User")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {


        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long user_id;

        @Column(unique = true, nullable = false)
        private String email;

        @Column(nullable = false)
        private String password;

        private String name;
        private String gender;
        private String phone;
        private String address;

        @Temporal(TemporalType.DATE)
        private Date birth_date;

        private String role;

        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
        private List<Appointment> appointments ;

        @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
        private List<Blog> blogs ;
        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
        private List<FeedBack> feedBacks = new ArrayList<>(); // Danh sách phản hồi của người dùng





}
