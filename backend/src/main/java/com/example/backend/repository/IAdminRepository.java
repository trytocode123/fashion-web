package com.example.backend.repository;

import com.example.backend.entity.Account;
import com.example.backend.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IAdminRepository extends JpaRepository<Admin, Long> {
    Admin findAdminByAccount(Account account);
}
