package com.example.backend.cotroller;

import com.example.backend.dto.AccountDTO;
import com.example.backend.dto.CustomerDTO;
import com.example.backend.entity.Account;
import com.example.backend.entity.AuthProvider;
import com.example.backend.entity.Customer;
import com.example.backend.entity.Gender;
import com.example.backend.service.ICustomerService;
import com.example.backend.service.impl.JwtResponseService;
import com.example.backend.service.impl.JwtService;
import com.example.backend.service.impl.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/v1/api")
public class AccountController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AccountService accountService;
    private final ICustomerService customerService;
    private final PasswordEncoder passwordEncoder;

    public AccountController(AuthenticationManager authenticationManager, JwtService jwtService, AccountService accountService, ICustomerService customerService, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.accountService = accountService;
        this.customerService = customerService;
        this.passwordEncoder = passwordEncoder;
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
                    userInfo.getUsername(), customer.getFullName(), userDetails.getAuthorities()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody CustomerDTO customerDTO) {
        Account accountFind = accountService.findByUsername(customerDTO.getEmail());
        Customer customerFind = customerService.findCustomerByAccount(accountFind);
        if (accountFind != null) {
            if (customerFind != null) {
                customerFind.setFullName(customerDTO.getFullName());
                customerFind.setDob(LocalDate.parse(customerDTO.getDob()));
                customerFind.setGender(Gender.valueOf(customerDTO.getGender()));
                customerFind.setEmail(customerDTO.getEmail());
                customerFind.setPhoneNumber(customerDTO.getPhoneNumber());
                customerFind.setAddress(customerDTO.getAddress());
                customerService.add(customerFind);
            }

            accountFind.setUsername(customerDTO.getUsername());
            accountFind.setPassword(passwordEncoder.encode(customerDTO.getPassword()));
            accountFind.setProvider(AuthProvider.LOCAL);
            accountService.add(accountFind);
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
            account.setPassword(customerDTO.getPassword());
            account.setProvider(AuthProvider.LOCAL);
            account.setRoles(customerDTO.getRoles());
            customer.setAccount(account);
            accountService.add(account);
            customerService.add(customer);
        }

        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
