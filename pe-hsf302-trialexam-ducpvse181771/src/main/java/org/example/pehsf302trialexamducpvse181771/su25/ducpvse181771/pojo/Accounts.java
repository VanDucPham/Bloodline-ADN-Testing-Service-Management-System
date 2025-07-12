package org.example.pehsf302trialexamducpvse181771.su25.ducpvse181771.pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Accounts")
public class Accounts   {
    @Id
    @Column(name ="Email",columnDefinition = "nvarchar(50)")
    private String email;
    @Column(name = "Password",columnDefinition = "nvarchar(50)")
    private String password;
    @Column(name = "RoleID")
    private int roleID;

    public Accounts() {
    }

    public Accounts(String email, String password, int roleID) {
        this.email = email;
        this.password = password;
        this.roleID = roleID;
    }
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getRoleID() {
        return roleID;
    }

    public void setRoleID(int roleID) {
        this.roleID = roleID;
    }
}
