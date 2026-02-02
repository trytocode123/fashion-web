package com.example.backend.cotroller;

import com.example.backend.dto.LoginResponseDTO;
import com.example.backend.entity.Account;
import com.example.backend.entity.Customer;
import com.example.backend.entity.Role;
import com.example.backend.service.GoogleOAuthService;
import com.example.backend.service.ICustomerService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/oauth2")
@CrossOrigin("*")
public class OAuth2Controller {
    private final GoogleOAuthService googleOAuthService;
    private final ICustomerService customerService;

    public OAuth2Controller(GoogleOAuthService googleOAuthService, ICustomerService customerService) {
        this.googleOAuthService = googleOAuthService;
        this.customerService = customerService;

    }

    @GetMapping("/google/callback")
    public void googleCallback(
            @RequestParam String code,
            HttpServletResponse response
    ) throws IOException {

        String redirectUrl = "http://localhost:5173/home?code=" +
                URLEncoder.encode(code, StandardCharsets.UTF_8);

        response.sendRedirect(redirectUrl);
    }

    @PostMapping("/auth/google")
    public LoginResponseDTO loginWithGoogle(@RequestBody Map<String, String> body) {
        String code = body.get("code");

        LoginResponseDTO login = googleOAuthService.loginWithGoogle(code);

        Customer customer = customerService
                .findByEmail(login.getUsername());

        Account account = customer.getAccount();

        List<String> roles = account.getRoles()
                .stream()
                .map(Role::getName)
                .toList();

        return LoginResponseDTO.builder()
                .token(login.getToken())
                .username(account.getUsername())
                .fullName(customer.getFullName())
                .roles(roles)
                .build();
    }
}
