package com.example.backend.dto;

import com.example.backend.entity.Role;
import lombok.*;

import java.util.Set;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {
    private Long id;
    private String name;
    private Set<Role> roles;
}
