package com.example.backend.controller;

import com.example.backend.dto.AccountDTO;
import com.example.backend.dto.CustomerDTO;
import com.example.backend.dto.CustomerProfileDTO;
import com.example.backend.entity.Account;
import com.example.backend.entity.AuthProvider;
import com.example.backend.entity.Customer;
import com.example.backend.entity.Gender;
import com.example.backend.service.IAccountService;
import com.example.backend.service.ICustomerService;
import com.example.backend.service.IEmailService;
import com.example.backend.service.impl.JwtResponseService;
import com.example.backend.service.impl.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@CrossOrigin("*")
@RestController
@RequestMapping("/v1/api")
public class AccountController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final IAccountService accountService;
    private final ICustomerService customerService;
    private final PasswordEncoder passwordEncoder;
    private final IEmailService emailService;

    public AccountController(AuthenticationManager authenticationManager, JwtService jwtService,
                             IAccountService accountService, ICustomerService customerService,
                             PasswordEncoder passwordEncoder, IEmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.accountService = accountService;
        this.customerService = customerService;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    /* ---------------- GET ALL USER ------------------------ */
    @GetMapping("/users")
    public ResponseEntity<List<AccountDTO>> getAllUser() {
        return new ResponseEntity<>(accountService.findAll(), HttpStatus.OK);
    }

    /* ---------------- GET USER BY ID ------------------------ */
    @GetMapping("/users/{id}")
    public ResponseEntity<Object> getUserById(@PathVariable Long id) {
        AccountDTO user = accountService.findById(id);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        return new ResponseEntity<>("Not Found User", HttpStatus.NO_CONTENT);
    }

    /* ---------------- CREATE NEW USER ------------------------ */
    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody Account account) {
        if (accountService.add(account)) {
            return new ResponseEntity<>("Created!", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("User Existed!", HttpStatus.BAD_REQUEST);
        }
    }

    /* ---------------- DELETE USER ------------------------ */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUserById(@PathVariable Long id) {
        accountService.delete(id);
        return new ResponseEntity<>("Deleted!", HttpStatus.OK);
    }

    /* ---------------- LOGIN ------------------------ */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Account user) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtService.generateTokenLogin(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Account userInfo = accountService.findByUsername(user.getUsername());
            Customer customer = customerService.findCustomerByAccount(userInfo);
            return ResponseEntity.ok(new JwtResponseService(userInfo.getId(), jwt,
                    userInfo.getUsername(), customer.getFullName(), customer.getEmail(), userDetails.getAuthorities()));
        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Account not verified. Please check your email.");
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during login");
        }
    }

    /* ---------------- REGISTER ------------------------ */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody CustomerDTO customerDTO) {
        Customer existingCustomer = customerService.findByEmail(customerDTO.getEmail());
        if (existingCustomer != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("This email is already registered. Please use a different email or log in.");
        }

        String token = UUID.randomUUID().toString();
        Account accountFind = accountService.findByUsername(customerDTO.getUsername());

        if (accountFind != null) {
            Customer customerFind = customerService.findCustomerByAccount(accountFind);
            if (customerFind != null) {
                customerFind.setFullName(customerDTO.getFullName());
                customerFind.setDob(LocalDate.parse(customerDTO.getDob()));
                customerFind.setGender(Gender.valueOf(customerDTO.getGender()));
                customerFind.setEmail(customerDTO.getEmail());
                customerFind.setPhoneNumber(customerDTO.getPhoneNumber());
                customerFind.setAddress(customerDTO.getAddress());
                customerService.add(customerFind);
            }
            accountFind.setPassword(passwordEncoder.encode(customerDTO.getPassword()));
            accountFind.setProvider(AuthProvider.LOCAL);
            accountFind.setEnabled(false);
            accountFind.setVerificationToken(token);
            accountService.save(accountFind);
        } else {
            Customer customer = new Customer();
            Account account = new Account();
            customer.setFullName(customerDTO.getFullName());
            customer.setDob(LocalDate.parse(customerDTO.getDob()));
            customer.setGender(Gender.valueOf(customerDTO.getGender()));
            customer.setEmail(customerDTO.getEmail());
            customer.setPhoneNumber(customerDTO.getPhoneNumber());
            customer.setAddress(customerDTO.getAddress());

            account.setUsername(customerDTO.getUsername());
            account.setPassword(passwordEncoder.encode(customerDTO.getPassword()));
            account.setProvider(AuthProvider.LOCAL);
            account.setRoles(customerDTO.getRoles());
            account.setEnabled(false);
            account.setVerificationToken(token);

            customer.setAccount(account);
            accountService.save(account);
            customerService.add(customer);
        }

        emailService.sendVerificationMail(customerDTO.getEmail(), token);
        return new ResponseEntity<>("Please check your email to verify your account.", HttpStatus.CREATED);
    }

    /* ---------------- VERIFY EMAIL ------------------------ */
    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam("token") String token) {
        Account account = accountService.findByVerificationToken(token);
        if (account == null) {
            return ResponseEntity.badRequest().body("Link xác thực không hợp lệ hoặc đã hết hạn.");
        }

        if (!Boolean.TRUE.equals(account.getEnabled())) {
            account.setEnabled(true);
            account.setVerificationToken(null);
            accountService.save(account);
        }

        UserDetails userDetails = accountService.loadUserByUsername(account.getUsername());
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtService.generateTokenLogin(authentication);
        Customer customer = customerService.findCustomerByAccount(account);

        return ResponseEntity.ok(new JwtResponseService(
                account.getId(), jwt, account.getUsername(),
                customer.getFullName(), customer.getEmail(),
                userDetails.getAuthorities()));
    }

    /* ---------------- GET PROFILE ------------------------ */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        Account account = accountService.findByUsername(authentication.getName());
        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        Customer customer = customerService.findCustomerByAccount(account);
        if (customer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer profile not found");
        }

        CustomerProfileDTO profileDTO = new CustomerProfileDTO(
                customer.getFullName(),
                customer.getPhoneNumber(),
                customer.getDob() != null ? customer.getDob().toString() : null,
                customer.getAddress(),
                customer.getEmail(),
                customer.getGender() != null ? customer.getGender().name() : null
        );
        return ResponseEntity.ok(profileDTO);
    }

    /* ---------------- UPDATE PROFILE ------------------------ */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody CustomerProfileDTO profileDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        Account account = accountService.findByUsername(authentication.getName());
        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        Customer customer = customerService.findCustomerByAccount(account);
        if (customer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer profile not found");
        }

        if (profileDTO.getFullName() != null) customer.setFullName(profileDTO.getFullName());
        if (profileDTO.getPhoneNumber() != null) customer.setPhoneNumber(profileDTO.getPhoneNumber());
        if (profileDTO.getDob() != null && !profileDTO.getDob().isEmpty()) {
            customer.setDob(LocalDate.parse(profileDTO.getDob()));
        }
        if (profileDTO.getAddress() != null) customer.setAddress(profileDTO.getAddress());
        if (profileDTO.getGender() != null && !profileDTO.getGender().isEmpty()) {
            try {
                customer.setGender(Gender.valueOf(profileDTO.getGender()));
            } catch (IllegalArgumentException e) {

            }
        }

        customerService.add(customer);
        return ResponseEntity.ok("Profile updated successfully");
    }
}
