package org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.controller;

import jakarta.servlet.http.HttpSession;
import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo.Accounts;
import org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.service.AccountServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.support.SessionStatus;

@Controller
public class loginController {
    @Autowired
    private AccountServices accountServices;
    @GetMapping("/login")
    public String login() {
        return "login";
    }
    @PostMapping("/login")
    public String login(@RequestParam String email, @RequestParam String password, HttpSession session) {


        Accounts account = accountServices.loginAccount(email, password);

        if (account != null  ) {
          if(account.getRoleID() == 1 || account.getRoleID() == 3) {
              System.out.println("Login successful");
              session.setAttribute("acc", account);
              return "redirect:/home";
          }

        }
        System.out.println("Login failed");
        return "redirect:/home";
    }

    @GetMapping("/error")
    public String error() {
        return "Error";
    }
}
