package com.example.backend.repository;

import com.example.backend.entity.Account;
import com.example.backend.entity.Customer;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ICustomerRepository extends JpaRepository<Customer, Long> {
    Customer findCustomerByEmail(String email);

    Customer findCustomerByAccount(Account account);
}
