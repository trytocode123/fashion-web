package com.example.backend.config;


import com.example.backend.service.JwtService;
import com.example.backend.service.AccountService;
import com.example.backend.util.CustomAccessDeniedHandler;
import com.example.backend.util.JwtAuthenticationTokenFilter;
import com.example.backend.util.RestAuthenticationEntryPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration // Đánh dấu lớp này là lớp cấu hình
@EnableWebSecurity
public class SecurityConfig {
    // Bean tạo filter kiểm tra JWT trong mỗi request
    @Bean
    public JwtAuthenticationTokenFilter jwtAuthenticationFilter(
            JwtService jwtService,
            AccountService userService
    ) {
        return new JwtAuthenticationTokenFilter(jwtService, userService);
    }


    // Bean cung cấp AuthenticationManager để xử lý đăng nhập
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Cấu hình Provider để xác thực người dùng dựa trên DB và password encoder
    @Bean
    public DaoAuthenticationProvider authenticationProvider(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder
    ) {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    // Mã hóa mật khẩu sử dụng BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10); // độ mạnh 10 vòng
    }

    // Xử lý lỗi khi chưa đăng nhập (401 Unauthorized)
    @Bean
    public RestAuthenticationEntryPoint restServicesEntryPoint() {
        return new RestAuthenticationEntryPoint();
    }

    // Xử lý lỗi khi đã đăng nhập nhưng không đủ quyền (403 Forbidden)
    @Bean
    public CustomAccessDeniedHandler customAccessDeniedHandler() {
        return new CustomAccessDeniedHandler();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        String frontendUrl = System.getenv("FRONTEND_URL");
        if (frontendUrl == null || frontendUrl.isEmpty()) {
            frontendUrl = "http://localhost:5173";
        }

        config.setAllowedOrigins(List.of(frontendUrl));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    // Cấu hình chuỗi lọc bảo mật
    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtAuthenticationTokenFilter jwtAuthenticationFilter
    ) throws Exception {

        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable) // Tắt CSRF vì API không cần
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/v1/api/login").permitAll() // Cho phép mọi người truy cập login API
                        .requestMatchers("/v1/api/products").permitAll()
                        .requestMatchers("/v1/api/products/top8Trailer").permitAll()
                        .requestMatchers("/v1/api/payment/savePayment").hasAnyRole("ADMIN", "CUSTOMER")
                        .requestMatchers("/vnpay_return").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/api/products/detail/").hasAnyRole("ADMIN", "CUSTOMER")
                        .requestMatchers("/oauth2/**").permitAll() // Cho phép mọi người truy cập login API
                        .requestMatchers(HttpMethod.GET, "/v1/api/**").hasAnyRole("ADMIN", "CUSTOMER") // GET yêu cầu quyền USER hoặc ADMIN
                        .requestMatchers(HttpMethod.POST, "/v1/api/**").hasRole("ADMIN") // POST chỉ ADMIN mới có quyền
                        .requestMatchers(HttpMethod.DELETE, "/v1/api/**").hasRole("ADMIN") // DELETE chỉ ADMIN mới có quyền
                        .anyRequest().authenticated() // Các request khác yêu cầu đăng nhập
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(restServicesEntryPoint()) // Nếu chưa đăng nhập → trả về lỗi 401
                        .accessDeniedHandler(customAccessDeniedHandler()) // Nếu đã đăng nhập nhưng không đủ quyền → trả về lỗi 403
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Không dùng session, hoàn toàn dựa trên JWT
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
