package com.example.backend.service;

import com.example.backend.dto.GoogleUserInfoDTO;
import com.example.backend.entity.Account;
import com.example.backend.entity.AuthProvider;
import com.example.backend.entity.Customer;
import com.example.backend.entity.Role;
import com.example.backend.repository.ICustomerRepository;
import com.example.backend.repository.IRoleRepository;
import com.example.backend.repository.IAccountRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class CustomerService implements ICustomerService {
    final ICustomerRepository customerRepository;
    final IAccountRepository accountRepository;
    final IRoleRepository roleRepository;

    public CustomerService(ICustomerRepository customerRepository, IAccountRepository accountRepository, IRoleRepository roleRepository) {
        this.customerRepository = customerRepository;
        this.accountRepository = accountRepository;
        this.roleRepository = roleRepository;
    }



    public Customer createOrGetFromGoogle(GoogleUserInfoDTO googleUser) {

        // 1. Tìm customer theo email
        Customer customer = customerRepository.findCustomerByEmail(googleUser.getEmail());
        if (customer != null) {
            // 👉 Đã có account nội bộ → chỉ xác thực
            return customer;
        }

        // 2. Tìm user theo username (email)
        Account account = accountRepository.findByUsername(googleUser.getEmail());

        if (account == null) {
            // 👉 Chưa có account nội bộ → tạo mới
            Set<Role> roles = new HashSet<>();
            account = new Account();
            account.setUsername(googleUser.getEmail());
            account.setProvider(AuthProvider.valueOf("GOOGLE"));
            Role role = roleRepository.findRoleById(2L);
            roles.add(role);
            account.setRoles(roles);
            accountRepository.save(account);
        }

        // 3. Tạo customer
        customer = new Customer();
        customer.setEmail(googleUser.getEmail());
        customer.setFullName(googleUser.getName());
        customer.setAccount(account);
        return customerRepository.save(customer);
    }


    @Override
    public Customer findByEmail(String email) {
        return customerRepository.findCustomerByEmail(email);
    }

    @Override
    public Customer findCustomerByAccount(Account account) {
        return customerRepository.findCustomerByAccount(account);
    }
}
