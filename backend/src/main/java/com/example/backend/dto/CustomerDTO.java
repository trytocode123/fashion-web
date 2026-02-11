package com.example.backend.dto;

import com.example.backend.entity.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDTO {
    private String fullName;
    private String phoneNumber;
    private String dob;
    private String address;
    private String email;
    private String gender;
    private String username;
    private String password;
    private Set<Role> roles;
    @Enumerated(EnumType.STRING)
    private String provider;
}
