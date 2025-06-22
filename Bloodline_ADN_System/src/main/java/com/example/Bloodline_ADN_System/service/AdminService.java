package com.example.Bloodline_ADN_System.service;

import com.example.Bloodline_ADN_System.Entity.User;
import com.example.Bloodline_ADN_System.dto.CreateUserRequest;
import com.example.Bloodline_ADN_System.dto.UpdateServicePriceRequest;
import com.example.Bloodline_ADN_System.dto.UpdateServicePriceResponse;
import com.example.Bloodline_ADN_System.dto.accountResponse;

import java.util.List;

public interface AdminService {
    void createUser(CreateUserRequest request);
    List<accountResponse> getAllUsers();
    void updateUser(accountResponse response);
    void deleteUser(Long id);

    UpdateServicePriceResponse updateServicePrice(UpdateServicePriceRequest request);
}
