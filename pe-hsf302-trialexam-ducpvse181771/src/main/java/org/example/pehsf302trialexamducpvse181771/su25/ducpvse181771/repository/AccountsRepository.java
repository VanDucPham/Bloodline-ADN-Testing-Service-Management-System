package org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.repository;

import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo.Accounts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountsRepository extends JpaRepository<Accounts, String> {
    Accounts findByEmail(String email);
}
