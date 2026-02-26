package com.example.backend.service;

import com.example.backend.entity.Account;
import com.example.backend.entity.Admin;

public interface IAdminService {
    Admin findByAccount(Account account);
}
