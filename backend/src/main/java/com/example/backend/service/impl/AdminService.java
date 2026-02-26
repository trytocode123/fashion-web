package com.example.backend.service.impl;

import com.example.backend.entity.Account;
import com.example.backend.entity.Admin;
import com.example.backend.repository.IAdminRepository;
import com.example.backend.service.IAdminService;
import org.springframework.stereotype.Service;

@Service
public class AdminService implements IAdminService {
    private final IAdminRepository adminRepository;

    public AdminService(IAdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public Admin findByAccount(Account account) {
        return adminRepository.findAdminByAccount(account);
    }
}
