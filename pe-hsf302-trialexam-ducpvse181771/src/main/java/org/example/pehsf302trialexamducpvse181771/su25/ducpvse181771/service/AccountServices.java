package org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.service;

import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo.Accounts;

public interface AccountServices {
    public void createAccount(Accounts accounts);

    Accounts  loginAccount(String email, String password);


}
