package com.example.backend.service;

import com.example.backend.dto.AccountDTO;
import com.example.backend.entity.Account;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface IAccountService extends UserDetailsService {
    org.springframework.data.domain.Page<AccountDTO> findAll(org.springframework.data.domain.Pageable pageable);
    AccountDTO findById(Long id);
    Account findByUsername(String username);
    void delete(Long id);
    boolean add(Account account);
    void save(Account account);
    Account findByVerificationToken(String token);
    AccountDTO toDTO(Account user);
}
