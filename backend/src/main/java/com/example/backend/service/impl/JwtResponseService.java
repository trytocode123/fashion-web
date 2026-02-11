package com.example.backend.service.impl;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Getter
@Setter
@AllArgsConstructor
public class JwtResponseService {
    private Long id;
    private String token;
    private String type = "Bearer";
    private String username;
    private String name;
    private final Collection<? extends GrantedAuthority> authorities;

    public JwtResponseService(Long id, String token, String username, String name, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.token = token;
        this.username = username;
        this.name = name;
        this.authorities = authorities;
    }

    public String getTokenType() {
        return type;
    }

    public void setTokenType(String tokenType) {
        this.type = tokenType;
    }
}
