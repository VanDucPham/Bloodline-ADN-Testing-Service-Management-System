package org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.service;

import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo.Accounts;
import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.repository.AccountsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountServiceImpl implements AccountServices{
    @Autowired
    private  AccountsRepository accountsRepository;
    @Override
    public void createAccount(Accounts accounts) {
        accountsRepository.save(accounts);
    }

    @Override
    public Accounts loginAccount(String email, String password) {
        Accounts acc = accountsRepository.findByEmail(email) ;
        if(acc!= null &&acc.getPassword().equals(password)){
            System.out.println(acc);
            return acc;
        }

        return acc;
    }
}
