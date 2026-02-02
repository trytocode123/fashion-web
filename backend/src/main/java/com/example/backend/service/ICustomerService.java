package com.example.backend.service;

import com.example.backend.entity.Account;
import com.example.backend.entity.Customer;

public interface ICustomerService {
    Customer findByEmail(String email);
    Customer findCustomerByAccount(Account account);
}
