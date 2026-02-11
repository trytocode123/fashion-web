package com.example.backend.service;

import com.example.backend.dto.AccountDTO;
import com.example.backend.entity.Account;

import java.util.List;

public interface IAccountService {
    List<AccountDTO> findAll();
    AccountDTO findById(Long id);
    Account findByUsername(String username);
    void delete(Long id);
    AccountDTO toDTO(Account user);
}
