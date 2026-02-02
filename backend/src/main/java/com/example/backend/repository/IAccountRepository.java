package com.example.backend.repository;

import com.example.backend.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IAccountRepository extends JpaRepository<Account, Long> {
    Account findByUsername(String username);
}
