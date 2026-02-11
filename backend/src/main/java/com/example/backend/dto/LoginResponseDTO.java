package com.example.backend.dto;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class LoginResponseDTO {
    private String token;
    private String username;
    private String fullName;
    private String email;
    private List<String> roles;
}
