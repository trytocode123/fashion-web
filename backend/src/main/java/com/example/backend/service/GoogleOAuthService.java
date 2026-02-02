package com.example.backend.service;

import com.example.backend.dto.GoogleTokenResponseDTO;
import com.example.backend.dto.GoogleUserInfoDTO;
import com.example.backend.dto.LoginResponseDTO;
import com.example.backend.entity.Customer;
import com.example.backend.entity.Role;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@Setter
@Getter
public class GoogleOAuthService {

    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.client-secret}")
    private String clientSecret;

    @Value("${google.redirect-uri}")
    private String redirectUri;

    private final RestTemplate restTemplate = new RestTemplate();
    private final CustomerService customerService;
    private final JwtService jwtService;

    public GoogleOAuthService(CustomerService customerService, JwtService jwtService) {
        this.customerService = customerService;
        this.jwtService = jwtService;
    }

    // ====== PUBLIC – controller gọi ======
    public LoginResponseDTO loginWithGoogle(String code) {

        // 1. Đổi code → access_token
        GoogleTokenResponseDTO token = exchangeCode(code);

        // 2. Lấy info người dùng Google
        GoogleUserInfoDTO userInfo = getUserInfo(token.getAccessToken());

        // 3. Tìm / tạo user nội bộ
        Customer customer = customerService.findByEmail(userInfo.getEmail());
        if (customer == null) {
            customer = customerService.createOrGetFromGoogle(userInfo);
        }

        // 4. Sinh JWT của HỆ THỐNG BẠN
        String jwt = jwtService.generateTokenFromUsername(
                customer.getAccount().getUsername()
        );

        List<String> roles = customer.getAccount()
                .getRoles()
                .stream()
                .map(Role::getName)
                .toList();

        // 5. Trả về cho FE
        return new LoginResponseDTO(
                jwt,
                customer.getAccount().getUsername(),
                customer.getFullName(),
                roles
        );
    }


    // ====== PRIVATE HELPERS ======
    private GoogleTokenResponseDTO exchangeCode(String code) {

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", clientId.trim());
        params.add("client_secret", clientSecret.trim());
        params.add("redirect_uri", redirectUri.trim());
        params.add("grant_type", "authorization_code");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        return restTemplate.postForObject(
                "https://oauth2.googleapis.com/token",
                new HttpEntity<>(params, headers),
                GoogleTokenResponseDTO.class
        );
    }

    private GoogleUserInfoDTO getUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        return restTemplate.exchange(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                GoogleUserInfoDTO.class
        ).getBody();
    }
}
