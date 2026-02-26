package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerProfileDTO {
    private String fullName;
    private String phoneNumber;
    private String dob;
    private String address;
    private String email;
    private String gender;
}
