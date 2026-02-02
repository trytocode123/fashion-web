package com.example.backend.service;

import com.example.backend.dto.AccountDTO;
import com.example.backend.entity.Account;
import com.example.backend.entity.UserPrinciple;
import com.example.backend.repository.IAccountRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AccountService implements UserDetailsService {
    private final IAccountRepository iAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountService(IAccountRepository iAccountRepository, PasswordEncoder passwordEncoder) {
        this.iAccountRepository = iAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public List<AccountDTO> findAll() {
        List<AccountDTO> accountDTOS = new ArrayList<>();
        for (Account u :iAccountRepository.findAll()) {
            accountDTOS.add(toDTO(u));
        }
        return accountDTOS;
    }

    public AccountDTO findById(Long id) {
        Optional<Account> user = iAccountRepository.findById(id);
        return user.map(this::toDTO).orElse(null);
    }

    public Account findByUsername(String username) {
        return iAccountRepository.findByUsername(username);
    }

    public boolean add(Account user) {
        String passwordEncode = passwordEncoder.encode(user.getPassword());
        user.setPassword(passwordEncode);
        iAccountRepository.save(user);
        return true;
    }

    public void delete(Long id) {
        iAccountRepository.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        Account account = iAccountRepository.findByUsername(username);
        if (account != null) {
            return UserPrinciple.build(account);
        }
        return null;
    }

    public AccountDTO toDTO(Account user) {
        return new AccountDTO(user.getId(), user.getUsername(), user.getRoles());
    }
}
