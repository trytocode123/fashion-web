package com.example.backend.service.impl;

import com.example.backend.dto.AccountDTO;
import com.example.backend.entity.Account;
import com.example.backend.entity.UserPrinciple;
import com.example.backend.repository.IAccountRepository;
import com.example.backend.service.IAccountService;
import org.jspecify.annotations.NullMarked;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AccountService implements UserDetailsService, IAccountService {
    private final IAccountRepository iAccountRepository;

    public AccountService(IAccountRepository iAccountRepository) {
        this.iAccountRepository = iAccountRepository;

    }


    @Override
    public org.springframework.data.domain.Page<AccountDTO> findAll(org.springframework.data.domain.Pageable pageable) {
        return iAccountRepository.findAll(pageable).map(this::toDTO);
    }

    public AccountDTO findById(Long id) {
        Optional<Account> user = iAccountRepository.findById(id);
        return user.map(this::toDTO).orElse(null);
    }

    public Account findByUsername(String username) {
        return iAccountRepository.findByUsername(username).orElse(null);
    }

    public boolean add(Account user) {
        iAccountRepository.save(user);
        return true;
    }

    public void save(Account account) {
        iAccountRepository.save(account);
    }

    public Account findByVerificationToken(String token) {
        return iAccountRepository.findByVerificationToken(token).orElse(null);
    }

    public void delete(Long id) {
        iAccountRepository.deleteById(id);
    }

    @Override
    @NullMarked
    public UserDetails loadUserByUsername(String username) {
        Account account = iAccountRepository.findByUsername(username).orElse(null);
        if (account != null) {
            return UserPrinciple.build(account);
        }
        throw new UsernameNotFoundException("Username not found");
    }

    public AccountDTO toDTO(Account user) {
        return new AccountDTO(user.getId(), user.getUsername(), user.getRoles());
    }
}
